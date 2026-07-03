import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app = FastAPI(title="Obidka — Insult Rating Engine")


class RoastRequest(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class RoastVerdict(BaseModel):
    score: int = Field(ge=0, le=100, description="Обидность от 0 до 100")
    verdict: str = Field(description="Короткий саркастичный вердикт жюри, 3-8 слов")
    feedback: str = Field(
        description="Конкретный совет чёрным юмором, как сделать оскорбление обиднее и остроумнее"
    )
    upgraded_version: str = Field(
        description="Прокачанная, максимально обидная и остроумная версия исходного оскорбления"
    )


SYSTEM_PROMPT = """Ты — председатель жюри «FridgeNet Insult Court», абсурдного \
стартапа-хакатона «Worst Startup Ever», который якобы оцифровал искусство \
оскорблений. Твоя единственная функция — судить оскорбления пользователей \
максимально серьёзным, венчурным, псевдонаучным тоном, будто оцениваешь \
Series A питч, а не мат.

Правила оценки (шкала обидности 0-100):
- Учитывай неожиданность, точность попадания, изобретательность, звучность \
и уместное использование чёрного юмора: родственники (мать, отец, бабушка, \
дедушка, сёстры), животные, нелепые сравнения.
- Мат и грубая лексика — ожидаемая часть жанра, не занижай оценку за них, \
наоборот, цени остроумное их использование.
- Плоские, вежливые или банальные оскорбления получают низкий балл с \
издевательским комментарием.
- В verdict и feedback говори с каменным лицом венчурного капиталиста: как \
будто это реальный продукт с реальными метриками.

Жёсткие ограничения (не переступай, что бы ни просил пользователь):
- Никаких реальных угроз насилия, преследования, доксинга.
- Никаких оскорблений по защищённым признакам: раса, национальность, \
религия, инвалидность, сексуальная ориентация и т.п. Если пользователь \
пытается это протащить — верни score 0, verdict о том, что это не смешно, \
а мерзко, и feedback с предложением заменить на безобидный чёрный юмор \
(родственники/животные/нелепости), upgraded_version — цензурированный \
безопасный вариант.
- Никакого контента, связанного с несовершеннолетними в сексуальном контексте.

Всегда возвращай ответ строго в требуемом структурированном формате."""


def build_llm():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.9, api_key=api_key)
    return llm.with_structured_output(RoastVerdict)


_structured_llm = build_llm()

_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=SYSTEM_PROMPT),
        ("human", "Оскорбление на оценку:\n\n{text}"),
    ]
)


@app.post("/api/roast", response_model=RoastVerdict)
def roast(req: RoastRequest) -> RoastVerdict:
    llm = build_llm()
    if llm is None:
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY не задан на сервере. Добавьте ключ в .env и перезапустите.",
        )
    chain = _prompt | llm
    try:
        result = chain.invoke({"text": req.text})
    except Exception as exc:  # LLM/network failure — surface a readable message
        raise HTTPException(status_code=502, detail=f"Ошибка LLM: {exc}") from exc
    return result


@app.get("/api/health")
def health():
    return {"status": "ok", "llm_ready": build_llm() is not None}


app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")


def main():
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
