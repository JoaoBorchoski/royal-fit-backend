interface IDestructureBuilderProps {
  data: object[]
  ref: string
  variablesToArray: string[]
  nameArrayVariable: string
}

// Object Iteractions

const objectConstructor = (element: any, variablesToArray: string[], nameArrayVariable: string): Object => {
  const object = new Object()

  Object.keys(element).forEach((variable) => {
    if (!variablesToArray.includes(variable)) object[variable] = null
  })

  object[nameArrayVariable] = null

  return object
}

const objectPopulate = (element: any, objectToPopulate: object): Object => {
  Object.keys(objectToPopulate).forEach((key) => (objectToPopulate[key] = element[key] ?? null))
  return objectToPopulate
}

// Array Iteractions

const refsUniquesConstructor = (data: object[], ref: string): string[] => {
  const refs: string[] = []
  data.map((item) => refs.push(item[ref]))

  return Array.from(new Set(refs))
}

const arrayConstructor = (data: object[], ref: string, refValue: string, variablesToArray: string[]) => {
  const dataFiltered = data.filter((item) => item[ref] === refValue)

  const array = []
  dataFiltered.map((item) => {
    const newObject = new Object()
    variablesToArray.map((variable) => (newObject[variable] = item[variable]))
    array.push(newObject)
  })

  return array
}

// Main

export const destructor = ({ data, ref, variablesToArray, nameArrayVariable }: IDestructureBuilderProps) => {
  const objects = []

  const refsUniques = refsUniquesConstructor(data, ref)

  refsUniques.map((refUnique) => {
    const firstElementByRefUnique = data.filter((item) => item[ref] === refUnique)[0]
    let object = objectConstructor(firstElementByRefUnique, variablesToArray, nameArrayVariable)
    object = objectPopulate(firstElementByRefUnique, object)
    object[nameArrayVariable] = arrayConstructor(data, ref, refUnique, variablesToArray)
    objects.push(object)
  })

  return objects
}
