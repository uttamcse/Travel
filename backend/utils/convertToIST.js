// Helper function to convert date to IST
const convertToIST = (date) => {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

module.exports = convertToIST;

