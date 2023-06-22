migrate((db) => {
  const collection = new Collection({
    "id": "vc4s8wpu35hbxwq",
    "created": "2023-06-22 09:27:06.773Z",
    "updated": "2023-06-22 09:27:06.773Z",
    "name": "brianstorms",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mx9txlsf",
        "name": "suggestions",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
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
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq");

  return dao.deleteCollection(collection);
})
