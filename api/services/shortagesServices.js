const db = require('../../db/knex');
const reportsModel = require('../models/shortagesModels');
const categoriesModel = require('../models/categories-model');

exports.getAllReports = async query => {
  return await reportsModel.getAllReports(query);
};

exports.getReportById = async id => {
  const report = await reportsModel.getReportById(id);

  if (!report) {
    const error = new Error('Report does not exist.');
    error.status = 404;
    throw error;
  }

  return report;
};

exports.getReportsByCategory = async category => {
  const match = await categoriesModel.getCategoriesByNames(category);

  if (!match.length) {
    const error = new Error('Category is not valid.');
    error.status = 404;
    throw error;
  }

  return await reportsModel.getReportsByCategory(category);
};

exports.createReport = async (
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
    const report = await reportsModel.createReport(trx, {
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

    await reportsModel.createReportCategories(
      trx,
      allCategories.map(category => ({
        report_id: report.id,
        category_id: category.id,
      })),
    );

    return { ...report, categories: cleanedCategories };
  });
};

exports.updateReport = async (
  reportId,
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
  const existingReport = await reportsModel.getReportById(reportId);

  if (!existingReport) {
    const error = new Error('Report does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingReport.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only edit your own reports.');
    error.status = 403;
    throw error;
  }

  const cleanedCategories = [...new Set(categories.filter(Boolean))];

  if (!cleanedCategories.length) {
    const error = new Error('At least one category is required.');
    error.status = 400;
    throw error;
  }

  const matchedCategories =
    await categoriesModel.getCategoriesByNames(cleanedCategories);

  if (matchedCategories.length !== cleanedCategories.length) {
    const error = new Error('One or more categories are not valid.');
    error.status = 404;
    throw error;
  }

  const existingCategoryRows = await reportsModel.getReportCategories(reportId);

  const existingCategories = existingCategoryRows
    .map(row => row.category)
    .sort();

  const nextCategories = [...cleanedCategories].sort();

  const noReportChanges =
    existingReport.title === title &&
    existingReport.summary === summary &&
    existingReport.mgrs === mgrs &&
    existingReport.lat_long === lat_long &&
    existingReport.recommendations === recommendations &&
    existingReport.priority === priority;

  const noCategoryChanges =
    JSON.stringify(existingCategories) === JSON.stringify(nextCategories);

  if (noReportChanges && noCategoryChanges) {
    const error = new Error('No changes detected.');
    error.status = 400;
    throw error;
  }

  const updatedReport = await db.transaction(async trx => {
    const report = await reportsModel.updateReport(trx, reportId, {
      title,
      summary,
      mgrs,
      lat_long,
      recommendations,
      priority,
    });

    await reportsModel.deleteReportCategories(trx, reportId);

    await reportsModel.createReportCategories(
      trx,
      matchedCategories.map(category => ({
        report_id: Number(reportId),
        category_id: category.id,
      })),
    );

    return report;
  });

  return updatedReport;
};

exports.deleteReport = async (id, user) => {
  const existingReport = await reportsModel.getReportById(id);

  if (!existingReport) {
    const error = new Error('Report does not exist.');
    error.status = 404;
    throw error;
  }

  const isAdmin = user.role === 'admin';
  const isOwner = existingReport.submitted_by === user.id;

  if (!isAdmin && !isOwner) {
    const error = new Error('You can only delete your own reports.');
    error.status = 403;
    throw error;
  }

  const [deletedReport] = await reportsModel.deleteReport(id);

  return deletedReport;
};
