const sequelize = require("./config/database");

async function selectData(num, email) {
  try {
    let [x] = await sequelize.query(
      `SELECT id, phoneNumber,email FROM Contact WHERE email = '${email}' OR phoneNumber = '${num}' ORDER BY id ASC`
    );
    let id;
    let emails = [];
    let nums = [];
    let ids = [];
    if (x.length === 0) {
      id = null;
    } else {
      id = x[0].id;
      for (let i = 0; i < x.length; i++) {
        emails.push(x[i].email);
        nums.push(x[i].phoneNumber);
        ids.push(x[i].id);
      }
      (emails = emails.filter((value, index, self) => {
        return self.indexOf(value) === index;
      })),
        (nums = nums.filter((value, index, self) => {
          return self.indexOf(value) === index;
        }));
      ids.shift();
      ids = ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    }
    return { id, nums, emails, ids };
  } catch (error) {
    console.error(error);
  }
}

async function selectSpecData(num, email) {
  try {
    let [x] = await sequelize.query(
      `SELECT id FROM Contact WHERE phoneNumber = '${num}' AND email = '${email}' ORDER BY id ASC`
    );
    return x;
  } catch (error) {
    console.error(error);
  }
}

async function checkNum(num) {
  try {
    let [x] = await sequelize.query(
      `SELECT * FROM Contact WHERE phoneNumber = '${num}' ORDER BY id ASC`
    );
    return x;
  } catch (error) {
    console.error(error);
  }
}

async function checkEmail(email) {
  try {
    let [x] = await sequelize.query(
      `SELECT * FROM Contact WHERE email = '${email}' ORDER BY id ASC`
    );
    return x;
  } catch (error) {
    console.error(error);
  }
}

async function insertContactData(num, email, linkedId, precedence) {
  try {
    let [x] = await sequelize.query(`SELECT * FROM Contact`);

    let idNum = x.length + 1 || 1;
    await sequelize.query(`
      INSERT INTO Contact (id, phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt)
      VALUES (${idNum}, '${num}', '${email}', ${linkedId}, '${precedence}', UTC_TIMESTAMP(), UTC_TIMESTAMP(), NULL)
    `);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

async function updateContactData(num, email, id) {
  try {
    await sequelize.query(`UPDATE Contact
    SET linkedId = ${id}, linkPrecedence = 'secondary'
    WHERE (phoneNumber = '${num}' OR email = '${email}') AND linkedId IS NULL AND linkPrecedence = 'primary' AND id != ${id};`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  selectData,
  insertContactData,
  selectSpecData,
  updateContactData,
  checkNum,
  checkEmail,
};
