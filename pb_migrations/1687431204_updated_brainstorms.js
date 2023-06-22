migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // remove
  collection.schema.removeField("outp8hcl")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "outp8hcl",
    "name": "sessionId",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
