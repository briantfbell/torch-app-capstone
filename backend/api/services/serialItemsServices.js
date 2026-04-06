const db = require('../../db/knex');
const serialItemsModels = require('../models/serialItemsModels');

exports.getAllSerialItems = async query => {
  return await serialItemsModels.getAllSerialItem(query);
};

exports.getSerialItemById = async id => {
  const serialItem = await serialItemsModels.getSerialItemById(id);

  if (!serialItem) {
    const error = new Error('End item does not exist.');
    error.status = 404;
    throw error;
  }

  return serialItem;
};

exports.createSerialItem = async (
  userId,
  {
    title,
    summary,
    mgrs,
    lat_long,
    recommendations,
    priority,
    classification,
    categories = [],
  },
) => {
  if (
    !title ||
    !summary ||
    !mgrs ||
    !lat_long ||
    !recommendations ||
    !priority ||
    !classification
  ) {
    const error = new Error('All fields are required.');
    error.status = 400;
    throw error;
  }

  const cleanedCategories = [...new Set(categories.filter(Boolean))];

  if (!cleanedCategories.length) {
    const error = new Error('At least one category is required.');
    error.status = 400;
    throw error;
  }

  return await db.transaction(async trx => {
    const SerialItem = await serialItemsModels.createSerialItem(trx, {
      title,
      summary,
      mgrs,
      lat_long,
      recommendations,
      priority,
      classification,
      submitted_by: userId,
    });

    const existingCategories = await categoriesModel.getCategoriesByNames(
      cleanedCategories,
      trx,
    );

    const existingNames = existingCategories.map(category => category.category);

    const missingNames = cleanedCategories.filter(
      categoryName => !existingNames.includes(categoryName),
    );

    let newCategories = [];

    if (missingNames.length) {
      newCategories = await categoriesModel.createCategories(trx, missingNames);
    }

    const allCategories = [...existingCategories, ...newCategories];

    await serialItemsModels.createSerialItemCategories(
      trx,
      allCategories.map(category => ({
        SerialItem_id: SerialItem.id,
        category_id: category.id,
      })),
    );

    return { ...SerialItem, categories: cleanedCategories };
  });
};

exports.updateSerialItem = async (
  SerialItemId,
  user,
  {
    title,
    summary,
    mgrs,
    lat_long,
    recommendations,
    priority,
    categories = [],
  },
) => {
  const existingSerialItem =
    await serialItemsModels.getSerialItemById(SerialItemId);

  if (!existingSerialItem) {
    const error = new Error('SerialItem does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingSerialItem.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only edit your own SerialItem.');
    error.status = 403;
    throw error;
  }

  const nextCategories = [...cleanedCategories].sort();

  const noSerialItemChanges =
    existingSerialItem.title === title &&
    existingSerialItem.summary === summary &&
    existingSerialItem.mgrs === mgrs &&
    existingSerialItem.lat_long === lat_long &&
    existingSerialItem.recommendations === recommendations &&
    existingSerialItem.priority === priority;

  const noCategoryChanges =
    JSON.stringify(existingCategories) === JSON.stringify(nextCategories);

  if (noSerialItemChanges && noCategoryChanges) {
    const error = new Error('No changes detected.');
    error.status = 400;
    throw error;
  }

  const updatedSerialItem = await db.transaction(async trx => {
    const SerialItem = await serialItemsModels.updateSerialItem(
      trx,
      SerialItemId,
      {
        title,
        summary,
        mgrs,
        lat_long,
        recommendations,
        priority,
      },
    );

    await serialItemsModels.deleteSerialItemCategories(trx, SerialItemId);

    await serialItemsModels.createSerialItemCategories(
      trx,
      matchedCategories.map(category => ({
        SerialItem_id: Number(SerialItemId),
        category_id: category.id,
      })),
    );

    return SerialItem;
  });

  return updatedSerialItem;
};

exports.deleteSerialItem = async (id, user) => {
  const existingSerialItem = await serialItemsModels.getSerialItemById(id);

  if (!existingSerialItem) {
    const error = new Error('SerialItem does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingSerialItem.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only delete your own SerialItem.');
    error.status = 403;
    throw error;
  }

  const [deletedSerialItem] = await serialItemsModels.deleteSerialItem(id);

  return deletedSerialItem;
};
