migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tq2vqfwsma5rkx")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lhatypyh",
    "name": "brainstormId",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "collectionId": "vc4s8wpu35hbxwq",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7tq2vqfwsma5rkx")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
