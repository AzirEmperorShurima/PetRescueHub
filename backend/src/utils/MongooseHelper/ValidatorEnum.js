export const getEnumValues = (model, field) => {
    const schema = model.schema;
    const path = schema.paths[field];
    return path && path.enumValues ? path.enumValues : [];
};