# Setup

Para levantar el frontend ejecuta:

primero --> `npm i` \
segundo --> `npm run dev`

Si te sale error que no reconoce o no exite node en tu pc, instalas
node en tu pc

### Ahora para el backend 

- Borras la carpeta llamada `venv/`
luego creas un entorno de ambiente

- Con windows es: `python -m venv venv`

- Luego de eso haces esto:
`pip install -r requirements.tsx`

Luego de eso levantas el servidor de de **FastAPI** con:

```ruby
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

_**Ojo**, las tablas se crean cuando levantas el servidor del backend sino solamente importas la base de datos que te pase._
