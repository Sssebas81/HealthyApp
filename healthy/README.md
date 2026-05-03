# HealthyApp

Aplicacion web para crear planes alimenticios personalizados, con registro de perfil, preferencias y una ayuda de IA integrada.

## Funcionalidades

- Registro y login de usuarios.
- Perfil con datos basicos de salud (peso y altura).
- Seleccion de meta personal (por ejemplo, mantener, bajar o subir peso).
- Seleccion de alimentos preferidos para personalizar recomendaciones.
- Generacion de un plan alimenticio a partir del perfil y preferencias.
- Chat con Healthy IA para resolver dudas y pedir recomendaciones.

## Happy Path (User Flow)

1. Registrate.
2. Logueate.
3. Selecciona tu peso y altura.
4. Elige tu meta.
5. Selecciona tus alimentos preferidos.
6. Crea tu plan alimenticio.
7. Habla con Healthy IA.

## Disclaimer

La IA integrada proviene de una API gratuita, por lo que su uso debe ser moderado.
Se debe de ejecutar el programa dentro de la rama llamada feature/Ia ya que aqui se encuentra la ultima version 
y esta es la cual esta desplegada

El uso del chat de ia no puede ser usado localmente a menos de tener la api key de gemini como variable de entorno asi que de querer usar este
por favor probarlo desde la pagina desplegada con su link respectivo ya que ahi se encuentra cargada directamente la api key

## Desarrollo

```bash
En caso de no estar en la carpeta del proyecto ejecutar los siguientes 2 comandos en terminal
ls
cd healthy/

Instala dependencias y ejecuta el servidor de desarrollo:
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
