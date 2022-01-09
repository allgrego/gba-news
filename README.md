# GBA News

A GBA Logistics microservice API to provide real-time News from different providers

**Author**: _Gregorio Alvarez < galvarez@gbalogistic.com >_
**Version**: 1.1.0

Based on [GBA Firebase Microservice Boilerplate](https://github.com/allgrego/gba-firebase-microservice-boilerplate).
**MUST be used with [GBA Firebase Functions Microservices Architecture Boilerplate](https://github.com/allgrego/gba-firebase-functions-microservices-boilerplate)**.

## Initial Setup

**Base URI**: `https://gbanews.web.app/v1/`
**Bearer Token is required**. All endpoints must content the Authorization header:

```
Authorization: Bearer {token}

```

## Endpoints
- GET /
- GET /mundomaritimo

### GET /

Provides a simple message about the app

Sample request:

```
https://gbanews.web.app/v1/

```

Response:

```
{
  name: "GBA News",
  description: "API for for management of news from different providers.",
  version: "1.1.0",
}

```

### GET /mundomaritimo

Obtain latest news from [mundo maritimo](https://www.mundomaritimo.cl)

Sample request:

```
https://gbanews.web.app/v1/mundomaritimo

```

Response:

```
{
  metadata: {
    lastUpdate: {
      timestamp: 1641712446861,
      date: "2022-01-09"
    },
    source: "https://www.mundomaritimo.cl"
  },
  data: [
    {
      id: 1,
      title: "Puertos de Paraná de Brasil cierran 2021 con 57,5 millones de toneladas movilizadas  ",
      description: "Caída en las exportaciones de maíz producto de la sequía evitaron un incremento mayor al 0,3% registrado ",
      date: "08 de Enero de 2022",
      image: {
        src: "https://www.mundomaritimo.cl/noticias/get_image/51146/107",
        width: "107"
      },
      url: "https://www.mundomaritimo.cl//noticias/puertos-de-parana-de-brasil-cierran-2021-con-575-millones-de-toneladas-movilizadas-"
    },
    {
      id: 2,
      title: "Cargamentos de GNL con destino a China se desvían a Europa para aprovechar mejores precios",
      description: "Crisis energética de Europa ha hecho que el gas en el continente sea más caro en relación con Asia",
      date: "08 de Enero de 2022",
      image: {
        src: "https://www.mundomaritimo.cl/noticias/get_image/51148/107",
        width: "107"
      },
      url: "https://www.mundomaritimo.cl//noticias/cargamentos-de-gnl-con-destino-a-china-se-desvian-a-europa-para-aprovechar-mejores-precios"
    },
    ...
    {
      id: 12,
      title: "Puerto Lázaro Cárdenas, México: Hutchison Port alcanza marca histórica tras movilizar 129.115 TEUs en diciembre del 2021",
      description: "El anterior récord de operación es de 122.330 TEUs y fue concretado en octubre de 2012",
      date: "07 de Enero de 2022",
      image: {
        src: "https://www.mundomaritimo.cl/noticias/get_image/51142/107",
        width: "107"
      },
      url: "https://www.mundomaritimo.cl//noticias/puerto-lazaro-cardenas-mexico-hutchison-port-alcanza-marca-historica-tras-movilizar-129115-teus-en-diciembre-del-2021"
    }
  ]
}

```
