migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // remove
  collection.schema.removeField("fltzuexl")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9khvjc8e",
    "name": "title",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "fltzuexl",
    "name": "votes",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9khvjc8e",
    "name": "suggestion",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
