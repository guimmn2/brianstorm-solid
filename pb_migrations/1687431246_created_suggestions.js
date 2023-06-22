migrate((db) => {
  const collection = new Collection({
    "id": "7tq2vqfwsma5rkx",
    "created": "2023-06-22 10:54:06.690Z",
    "updated": "2023-06-22 10:54:06.690Z",
    "name": "suggestions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "2natt7zl",
        "name": "suggestion",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rx8kwhii",
        "name": "votes",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "lhatypyh",
        "name": "brainstormId",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "vc4s8wpu35hbxwq",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("7tq2vqfwsma5rkx");

  return dao.deleteCollection(collection);
})
