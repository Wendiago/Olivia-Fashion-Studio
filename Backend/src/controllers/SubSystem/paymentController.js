const Account = require("../../models/Account");
const Transaction = require("../../models/Transaction");
const jwt = require("jsonwebtoken");
const middlewareController = require("../middlewareController");
const nodeMailer = require("../../utils/nodeMailer");
const crypto = require("crypto");

const paymentController = {
  createPaymentAccount: async (req, res) => {
    try {
      const { userId } = req.body;
      const newAccount = new Account({ userId });
      const savedAccount = await newAccount.save();
      res.status(201).json({
        success: true,
        data: savedAccount,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTransaction: async (req, res) => {
    try {
      const { accountId, amount, type } = req.body;
      const newTransaction = new Transaction({ accountId, amount, type });
      const savedTransaction = await newTransaction.save();
      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  sendVerifyEmail: async (req, res) => {
    try {
      const { email1, id } = req.body;
      const Code = crypto.randomBytes(3).toString("hex").toUpperCase();
      //console.log(Code);
      // Send email
      const content = {
        email: email1,
        subject: "Mã Thanh toán",

        html: `<p>Mã thanh toán là:
                      <b>${Code}</b>
                 </p>`,
      };

      const account = await Account.findOne({ userId: id });
      account.code = Code;
      await account.save();

      nodeMailer.sendMail(content);
      return res.status(200).json({
        success: true,
        message: "Please check your email !",
        data: content,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
        data: {},
      });
    }
  },

  verifyCodeEmail: async (req, res) => {
    try {
      const { code, id } = req.body;
      //console.log(code);
      const account = await Account.findOne({ userId: id });
      //console.log(account.code);
      if (code !== account.code) {
        return res.json({
          success: false,
          message: "Please check your code !",
        });
      }
      return res.status(200).json({
        success: true,
        message: "verify successfully !",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
        data: {},
      });
    }
  },

  executePayment: async (req, res) => {
    const { amount, userId } = req.body;
    //console.log(userId);
    const userAccount = await Account.findOne({ userId: userId });

    const adminId = "66c4b7e1f6acf6e9413f58a0";
    const adminAccount = await Account.findOne({ userId: adminId });

    try {
      if (!userAccount) {
        return res.json({
          success: false,
          message: "User account not found",
        });
      }

      if (userAccount.balance < amount) {
        const transaction = new Transaction({
          accountId: userAccount.id,
          amount: amount,
          type: "WITHDRAW",
          status: "FAILED",
        });
        await transaction.save();

        return res.json({
          success: false,
          message: "Insufficient balance",
        });
      }

      userAccount.balance -= amount;
      const updatedAccount = await userAccount.save();

      adminAccount.balance += amount;
      await adminAccount.save();

      const transaction = new Transaction({
        accountId: userAccount.id,
        amount: amount,
        type: "WITHDRAW",
        status: "COMPLETED",
      });
      await transaction.save();

      res.status(200).json({
        success: true,
        message: "Payment executed successfully",
        updatedAccount,
      });
    } catch (error) {
      const transaction = new Transaction({
        accountId: userAccount.id,
        amount: amount,
        type: "WITHDRAW",
        status: "FAILED",
      });
      await transaction.save();

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  getTransactionByUserId: async (req, res) => {
    try {
      const { userId } = req.body;
      const userAccount = await Account.findOne({ userId: userId });
      if (!userAccount) {
        return res.json({
          success: false,
          message: "User account not found",
        });
      }
      const transactions = await Transaction.find({
        accountId: userAccount._id,
      });
      return res.status(200).json({
        success: true,
        message: "Get transactions successfully",
        data: transactions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
        data: {},
      });
    }
  },

  deposit: async (req, res) => {
    try {
      const { amount, id } = req.body;
      const account = await Account.findOne({ userId: id });

      if (!account) {
        return res.json({
          success: false,
          message: "Account not found",
          data: {},
        });
      }
      account.balance += amount;
      await account.save();

      const newTransaction = new Transaction({
        accountId: account.id,
        amount: amount,
        type: "DEPOSIT",
        status: "COMPLETED",
      });
      const savedTransaction = await newTransaction.save();
      res.status(200).json({
        success: true,
        message: "Deposit successfully",
        data: savedTransaction,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getAmount: async (req, res) => {
    try {
      const { id } = req.body;
      const account = await Account.findOne({ userId: id });

      if (!account) {
        return res.json({
          success: false,
          message: "Account not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "get Amount successfully",
        data: account.balance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getAllTransaction: async (req, res) => {
    try {
      const { page, limit } = req.body;
      const offset = (page - 1) * limit;

      //const transactions = await Transaction.find().skip(offset).limit(limit)
      const transactions = await Transaction.find()
        .skip(offset)
        .limit(limit)
        .populate({
          path: "accountId",
          model: "Account",
          select: "userId", // select the fields you need
        });
      const totalTransactions = await Transaction.countDocuments().exec();
      if (!transactions) {
        return res.json({
          success: false,
          message: "transactions not found",
          data: {},
        });
      }

      res.status(200).json({
        success: true,
        message: "get Amount successfully",
        data: transactions,
        totalPages: Math.ceil(totalTransactions / limit),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = paymentController;
