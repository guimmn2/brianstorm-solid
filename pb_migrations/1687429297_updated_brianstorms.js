migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  collection.name = "brainstorms"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("vc4s8wpu35hbxwq")

  collection.name = "brianstorms"

  return dao.saveCollection(collection)
})
