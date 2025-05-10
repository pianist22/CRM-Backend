const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const axios = require('axios');

const simulateDelivery = () => (Math.random() < 0.9 ? 'SENT' : 'FAILED');

// exports.createCampaign = async (req, res) => {
//   try {
//     const { name, description, rules, message,userId } = req.body;

//     // Build MongoDB query based on rules
//     const mongoQuery = rules.reduce((acc, rule) => {
//       const fieldMap = {
//         spend: 'totalSpend',
//         visits: 'visitCount',
//         last_active: 'lastActive',
//       };

//       const field = fieldMap[rule.field];
//       const operator = rule.operator;
//       const value = rule.value;

//       if (!field || !operator || value === '') return acc;

//       const mongoOperator = {
//         '>': '$gt',
//         '<': '$lt',
//         '=': '$eq',
//       }[operator];

//       if (mongoOperator) {
//         acc.push({ [field]: { [mongoOperator]: isNaN(value) ? value : Number(value) } });
//       }

//       return acc;
//     }, []);

//     const finalQuery = mongoQuery.length > 0 ? { $and: mongoQuery } : {};
//     console.log("UserId ",userId);
//     const customers = await Customer.find(finalQuery);

//     const campaign = new Campaign({
//       name,
//       message,
//       description,
//       segmentRules: rules,
//       audienceSize: customers.length,
//       userId:userId,
//     });

//     await campaign.save();

//     const logs = customers.map((cust) => ({
//       campaignId: campaign._id,
//       customerId: cust._id,
//       status: simulateDelivery(),
//       message,
//       sentAt: new Date(),
//     }));

//     await CommunicationLog.insertMany(logs);

//     res.status(201).json({
//       campaign,
//       deliveryStats: {
//         sent: logs.filter((l) => l.status === 'SENT').length,
//         failed: logs.filter((l) => l.status === 'FAILED').length,
//       },
//     });
//   } catch (err) {
//     console.error('Error creating campaign:', err);
//     res.status(500).json({ message: err.message });
//   }
// };
const personalizeMessage = (template, customer) => {
  return template.replace('{{name}}', customer.name);
};

exports.createCampaign = async (req, res) => {
  try {
    const { name, description, rules, message, userId } = req.body;

    const mongoQuery = rules.reduce((acc, rule) => {
      const fieldMap = {
        spend: 'totalSpend',
        visits: 'visitCount',
        last_active: 'lastActive',
      };

      const field = fieldMap[rule.field];
      const operator = rule.operator;
      const value = rule.value;

      if (!field || !operator || value === '') return acc;

      const mongoOperator = {
        '>': '$gt',
        '<': '$lt',
        '=': '$eq',
      }[operator];

      if (mongoOperator) {
        acc.push({ [field]: { [mongoOperator]: isNaN(value) ? value : Number(value) } });
      }

      return acc;
    }, []);

    const finalQuery = mongoQuery.length > 0 ? { $and: mongoQuery } : {};

    const customers = await Customer.find(finalQuery);

    const campaign = new Campaign({
      name,
      message,
      description,
      segmentRules: rules,
      audienceSize: customers.length,
      userId,
    });

    await campaign.save();

    for (const cust of customers) {
      const personalizedMessage = personalizeMessage(message, cust);
      const log = await CommunicationLog.create({
        campaignId: campaign._id,
        customerId: cust._id,
        status: 'PENDING',
        message: personalizedMessage,
        sentAt: new Date(),
      });

      // Call Vendor API
      await axios.post('http://localhost:5000/api/v1/vendor/send', {
        logId: log._id,
        message: personalizedMessage,
      });
    }

    res.status(201).json({ campaign, message: 'Campaign sent to vendor for delivery!' });
  } catch (err) {
    console.error('Error creating campaign:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const userId = req.query.userId;
    const campaigns = await Campaign.find({userId}).sort({ createdAt: -1 });
    // Fetch delivery stats for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const logs = await CommunicationLog.find({ campaignId: campaign._id });
        return {
          ...campaign.toObject(),
          deliveryStats: {
            sent: logs.filter((log) => log.status === 'SENT').length,
            failed: logs.filter((log) => log.status === 'FAILED').length,
          },
        };
      })
    );

    res.status(200).json(campaignsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.getAudienceSize = async (req, res) => {
//   try {
//     const rules = req.body.rules;

//     const mongoQuery = rules.reduce((acc, rule) => {
//       const fieldMap = {
//         spend: 'totalSpend',
//         visits: 'visitCount',
//         last_active: 'lastActive',
//       };

//       const field = fieldMap[rule.field];
//       const operator = rule.operator;
//       const value = rule.value;

//       if (!field || !operator || value === '') return acc;

//       const mongoOperator = {
//         '>': '$gt',
//         '<': '$lt',
//         '=': '$eq',
//         '>=': '$gte',
//         '<=': '$lte',
//       }[operator];

//       if (mongoOperator) {
//         acc.push({
//           [field]: { [mongoOperator]: isNaN(value) ? value : Number(value) }
//         });
//       }

//       return acc;
//     }, []);

//     const finalQuery = mongoQuery.length > 0 ? { $and: mongoQuery } : {};

//     const customers = await Customer.find(finalQuery);
//     const audienceSize = customers.length;

//     return res.json({ audienceSize });

//   } catch (err) {
//     console.error("Error calculating audience size:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.getAudienceSize = async (req, res) => {
  try {
    const { rules } = req.body;

    const mongoQuery = rules.reduce((acc, rule) => {
      const fieldMap = {
        spend: 'totalSpend',
        visits: 'visitCount',
        last_active: 'lastActiveDate',
      };

      const field = fieldMap[rule.field];
      const operator = rule.operator;
      const value = rule.value;

      if (!field || !operator || value === '') return acc;

      const mongoOperator = {
        '>': '$gt',
        '<': '$lt',
        '=': '$eq',
        '>=': '$gte',
        '<=': '$lte',
      }[operator];

      if (!mongoOperator) return acc;

      if (rule.field === 'last_active') {
        const daysAgo = Number(value);
        if (isNaN(daysAgo)) return acc;

        const now = new Date();
        const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        // Invert logic: > N days ago => $lt
        const actualOperator = {
          '>': '$lt',
          '<': '$gt',
          '=': '$eq',
          '>=': '$lte',
          '<=': '$gte',
        }[operator];

        acc.push({
          [field]: { [actualOperator]: targetDate }
        });
      } else {
        acc.push({
          [field]: { [mongoOperator]: isNaN(value) ? value : Number(value) }
        });
      }

      return acc;
    }, []);

    const finalQuery = mongoQuery.length > 0 ? { $and: mongoQuery } : {};

    const customers = await Customer.find(finalQuery);
    const audienceSize = customers.length;

    return res.json({ audienceSize });

  } catch (err) {
    console.error("Error calculating audience size:", err);
    res.status(500).json({ error: "Server error" });
  }
};
