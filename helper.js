const sequelize = require("./config/database");

async function insertContactData(num, email) {
    try {
      let [x] = await sequelize.query(`SELECT * FROM Demo`);
  
      let idNum = x.length + 1 || 1
      // Insert first contact
      await sequelize.query(`
        INSERT INTO Demo (id, phoneNumber, email, linkedId, linkPrecedence, createdAt, updatedAt, deletedAt)
        VALUES (${idNum}, '${num}', '${email}', NULL, 'primary', UTC_TIMESTAMP(), UTC_TIMESTAMP(), NULL)
      `);
  
      console.log("Data inserted successfully!");
    } catch (error) {
      console.error("Error inserting data:", error);
    } finally {
      // Ensure to close the Sequelize connection when done
      await sequelize.close();
    }
  }

insertContactData("12222", "axah@email.com")