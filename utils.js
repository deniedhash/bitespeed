const sequelize = require("./config/database");

async function selectData(num, email) {
  try {
    let [x] = await sequelize.query(
      `SELECT id, phoneNumber,email FROM Demo WHERE email = '${email}' OR phoneNumber = '${num}' ORDER BY id ASC`
    );
    console.log("popop");
    console.log("HI", x);
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
      emails = emails.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      nums = nums.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      ids.shift();
      ids = ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      console.log("[][][][][][][][][]", ids);
    }
    return { id, nums, emails, ids };
  } catch (error) {
    console.error(error);
  }
}

async function selectSpecData(num, email) {
  try {
    let [x] = await sequelize.query(
      `SELECT id FROM Demo WHERE phoneNumber = '${num}' AND email = '${email}' ORDER BY id ASC`
    );
    console.log(x);
    return x;
  } catch (error) {
    console.error(error);
  }
}

async function insertContactData(num, email, linkedId, precedence) {
  try {
    let [x] = await sequelize.query(`SELECT * FROM Demo`);

    let idNum = x.length + 1 || 1;
    // Insert first contact
    await sequelize.query(`
      INSERT INTO Demo (id, phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt)
      VALUES (${idNum}, '${num}', '${email}', ${linkedId}, '${precedence}', UTC_TIMESTAMP(), UTC_TIMESTAMP(), NULL)
    `);

    console.log("Data inserted successfully!");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

async function updateContactData(num, email, id) {
  try {
    await sequelize.query(`UPDATE Demo
    SET linkedId = ${id}, linkPrecedence = 'secondary'
    WHERE (phoneNumber = '${num}' OR email = '${email}') AND linkedId IS NULL AND linkPrecedence = 'primary' AND id != ${id};`);
  } catch (error) {
    console.error(error);
  }
}

// insertContactData("123", "animesh");
// let x = selectData("1222", "opop")
// console.log(x)
module.exports = {
  selectData,
  insertContactData,
  selectSpecData,
  updateContactData,
};
