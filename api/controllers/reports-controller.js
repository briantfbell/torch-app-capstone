const reportsService = require('../services/reports-service');

exports.getAllReports = async (req, res) => {
  try {
    const { query } = req;
    const data = await reportsService.getAllReports(query);

    res.status(200).json({
      reports: data[0],
      total: Number(data[1]?.total || 0),
    });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportsService.getReportById(id);

    res.status(200).json(report);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.getReportsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const reports = await reportsService.getReportsByCategory(category);

    res.status(200).json(reports);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.createReport = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const newReport = await reportsService.createReport(userId, req.body);

    res
      .status(201)
      .json({
        newReport: newReport,
        message: `'${newReport.title}' has been successfully posted.`,
      });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await reportsService.updateReport(
      req.params.id,
      req.user,
      req.body,
    );

    res.status(200).json({
      message: `'${updatedReport.title}' has been successfully updated.`,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const deletedReport = await reportsService.deleteReport(
      req.params.id,
      req.user,
    );

    res
      .status(200)
      .json({ message: `'${deletedReport.title}' was successfully deleted.` });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal server error.' });
  }
};
