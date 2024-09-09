const bcrypt = require("bcrypt");
const generateHash = async () => {
  const saltRounds = 10;
  const password = "20122003";
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
  } catch (err) {
    console.error("Error generating hash:", err);
  }
};

generateHash();
