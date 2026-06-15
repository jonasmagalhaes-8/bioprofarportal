// @ts-nocheck


export const routes = {
  "meta": {},
  "id": "_default",
  "name": "",
  "file": {
    "path": "src/routes/_module.svelte",
    "dir": "src/routes",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "asyncModule": () => import('../src/routes/_module.svelte'),
  "rootName": "default",
  "routifyDir": import.meta.url,
  "children": [
    {
      "meta": {},
      "id": "_default_artigos",
      "name": "artigos",
      "file": {
        "path": "src/routes/artigos/_module.svelte",
        "dir": "src/routes/artigos",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "asyncModule": () => import('../src/routes/artigos/_module.svelte'),
      "children": [
        {
          "meta": {
            "isDefault": true
          },
          "id": "_default_artigos_index_svelte",
          "name": "index",
          "file": {
            "path": "src/routes/artigos/index.svelte",
            "dir": "src/routes/artigos",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "asyncModule": () => import('../src/routes/artigos/index.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {
        "isDefault": true
      },
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "src/routes/index.svelte",
        "dir": "src/routes",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "asyncModule": () => import('../src/routes/index.svelte'),
      "children": []
    },
    {
      "meta": {},
      "id": "_default_inicio",
      "name": "inicio",
      "file": {
        "path": "src/routes/inicio/_module.svelte",
        "dir": "src/routes/inicio",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "asyncModule": () => import('../src/routes/inicio/_module.svelte'),
      "children": [
        {
          "meta": {
            "isDefault": true
          },
          "id": "_default_inicio_index_svelte",
          "name": "index",
          "file": {
            "path": "src/routes/inicio/index.svelte",
            "dir": "src/routes/inicio",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "asyncModule": () => import('../src/routes/inicio/index.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_sobre",
      "name": "sobre",
      "file": {
        "path": "src/routes/sobre/_module.svelte",
        "dir": "src/routes/sobre",
        "base": "_module.svelte",
        "ext": ".svelte",
        "name": "_module"
      },
      "asyncModule": () => import('../src/routes/sobre/_module.svelte'),
      "children": [
        {
          "meta": {
            "isDefault": true
          },
          "id": "_default_sobre_index_svelte",
          "name": "index",
          "file": {
            "path": "src/routes/sobre/index.svelte",
            "dir": "src/routes/sobre",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "asyncModule": () => import('../src/routes/sobre/index.svelte'),
          "children": []
        }
      ]
    },
    {
      "meta": {
        "dynamic": true,
        "dynamicSpread": true,
        "order": false,
        "inline": false
      },
      "name": "[...404]",
      "file": {
        "path": ".routify/components/[...404].svelte",
        "dir": ".routify/components",
        "base": "[...404].svelte",
        "ext": ".svelte",
        "name": "[...404]"
      },
      "asyncModule": () => import('./components/[...404].svelte'),
      "children": []
    }
  ]
}
export default routes