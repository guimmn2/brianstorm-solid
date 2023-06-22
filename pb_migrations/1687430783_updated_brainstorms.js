migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // remove
  collection.schema.removeField("mx9txlsf")

  // add
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mx9txlsf",
    "name": "suggestions",
    "type": "json",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("9khvjc8e")

  // remove
  collection.schema.removeField("fltzuexl")

  return dao.saveCollection(collection)
})
