const db = require('../../db/knex');
const endItemsModels = require('../models/endItemsModels');

exports.getAllEndItems = async query => {
  return await endItemsModels.getAllEndItem(query);
};

exports.getEndItemById = async id => {
  const endItem = await endItemsModels.getEndItemById(id);

  if (!endItem) {
    const error = new Error('End item does not exist.');
    error.status = 404;
    throw error;
  }

  return endItem;
};

exports.createEndItem = async (
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
    const EndItem = await endItemsModels.createEndItem(trx, {
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

    await endItemsModels.createEndItemCategories(
      trx,
      allCategories.map(category => ({
        EndItem_id: EndItem.id,
        category_id: category.id,
      })),
    );

    return { ...EndItem, categories: cleanedCategories };
  });
};

exports.updateEndItem = async (
  EndItemId,
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
  const existingEndItem = await endItemsModels.getEndItemById(EndItemId);

  if (!existingEndItem) {
    const error = new Error('EndItem does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingEndItem.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only edit your own EndItem.');
    error.status = 403;
    throw error;
  }

  const nextCategories = [...cleanedCategories].sort();

  const noEndItemChanges =
    existingEndItem.title === title &&
    existingEndItem.summary === summary &&
    existingEndItem.mgrs === mgrs &&
    existingEndItem.lat_long === lat_long &&
    existingEndItem.recommendations === recommendations &&
    existingEndItem.priority === priority;

  const noCategoryChanges =
    JSON.stringify(existingCategories) === JSON.stringify(nextCategories);

  if (noEndItemChanges && noCategoryChanges) {
    const error = new Error('No changes detected.');
    error.status = 400;
    throw error;
  }

  const updatedEndItem = await db.transaction(async trx => {
    const EndItem = await endItemsModels.updateEndItem(trx, EndItemId, {
      title,
      summary,
      mgrs,
      lat_long,
      recommendations,
      priority,
    });

    await endItemsModels.deleteEndItemCategories(trx, EndItemId);

    await endItemsModels.createEndItemCategories(
      trx,
      matchedCategories.map(category => ({
        EndItem_id: Number(EndItemId),
        category_id: category.id,
      })),
    );

    return EndItem;
  });

  return updatedEndItem;
};

exports.deleteEndItem = async (id, user) => {
  const existingEndItem = await endItemsModels.getEndItemById(id);

  if (!existingEndItem) {
    const error = new Error('EndItem does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingEndItem.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only delete your own EndItem.');
    error.status = 403;
    throw error;
  }

  const [deletedEndItem] = await endItemsModels.deleteEndItem(id);

  return deletedEndItem;
};
