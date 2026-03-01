import jobModel from "../model/job.js";
import mongoose from "mongoose";
import moment from "moment"; // ရက်စွဲနာမည်ပြောင်းဖို့ moment library သုံးပါမယ်
import sanitize from "mongo-sanitize";
// ====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body;

    // ၁။ Validation စစ်ဆေးခြင်း
    if (!company || !position) {
        return next("Please Provide All Fields");
    }

    // ၂။ Login ဝင်ထားတဲ့ User ID ကို createdBy field ထဲ ထည့်ခြင်း
    // ဒါမှ ဘယ်သူတင်တဲ့အလုပ်လဲဆိုတာ သိမှာပါ
    req.body.createdBy = req.user.userId;

    // ၃။ Job အသစ် ဖန်တီးခြင်း
    const job = await jobModel.create(req.body);

    // ၄။ Response ပြန်ခြင်း
    res.status(201).json({
        success: true,
        message: "Job Created Successfully",
        job,
    });
};

// ====== GET ALL JOBS ======
export const getAllJobsController = async (req, res, next) => {
    try {
        const sanitizedQuery = sanitize(req.query);
        const { status, workType, search, sort } = sanitizedQuery;
        // const { status, workType, search, sort } = req.query;

        // ၁။ ရှာဖွေမည့် အခြေအနေများ (Condition Object) တည်ဆောက်ခြင်း
        // လက်ရှိ Login ဝင်ထားတဲ့ User ရဲ့ Job တွေကိုပဲ ရှာမှာပါ
        let queryObject = {
            createdBy: req.user.userId,
        };

        // Status နဲ့ Filter လုပ်ခြင်း (pending, interview, reject)
        if (status && status !== "all") {
            queryObject.status = status;
        }

        // Work Type နဲ့ Filter လုပ်ခြင်း (full-time, remote, etc.)
        if (workType && workType !== "all") {
            queryObject.workType = workType;
        }

        // Search Logic (Position ဒါမှမဟုတ် Company နာမည်မှာ ပါတာနဲ့ ရှာမယ်)
        if (search) {
            queryObject.position = { $regex: search, $options: "i" }; // 'i' ဆိုတာ case-insensitive (အကြီးအသေးမရွေး) ပါ
        }

        // ၂။ Database မှာ Query စတင်ပတ်ခြင်း
        let result = jobModel.find(queryObject);
        result = result.populate("createdBy", "name -_id -password");
        // ၃။ Sorting (စီစဉ်ခြင်း)21    +/
        4
        if (sort === "latest") {
            result = result.sort("-createdAt"); // အသစ်ဆုံး အပေါ်ကပြ
        }
        if (sort === "oldest") {
            result = result.sort("createdAt"); // အဟောင်းဆုံး အပေါ်ကပြ
        }
        if (sort === "a-z") {
            result = result.sort("position"); // အက္ခရာစဉ်အတိုင်းပြ
        }
        if (sort === "z-a") {
            result = result.sort("-position");
        }

        // ၄။ Pagination (စာမျက်နှာခွဲခြင်း)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10; // တစ်မျက်နှာကို ၁၀ ခုစီပြမယ်
        const skip = (page - 1) * limit;

        result = result.skip(skip).limit(limit);

        // ၅။ စုစုပေါင်း အလုပ်အရေအတွက်ကို တွက်ချက်ခြင်း
        const jobs = await result;
        const totalJobs = await jobModel.countDocuments(queryObject);
        const numOfPage = Math.ceil(totalJobs / limit);

        // ၆။ အဖြေပြန်ထုတ်ပေးခြင်း
        res.status(200).json({
            success: true,
            totalJobs,
            numOfPage,
            jobs,
        });

    } catch (error) {
        next(error);
    }
};

// ====== UPDATE JOB ======
export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;

    // ၁။ Validation စစ်ဆေးခြင်း
    if (!company || !position) {
        return next("Please Provide All Fields");
    }

    // ၂။ Database ထဲမှာ အဲဒီ Job ရှိ၊ မရှိ ရှာမယ်
    const job = await jobModel.findOne({ _id: id });

    if (!job) {
        return next(`No job found with this id ${id}`);
    }

    // ၃။ !!! အရေးကြီးဆုံးအချက် !!!
    // ဒီ Job ကို တင်ခဲ့တဲ့သူနဲ့ အခုပြင်ဖို့ ကြိုးစားနေတဲ့သူ တူ၊ မတူ စစ်မယ်
    if (req.user.userId !== job.createdBy.toString()) {
        return next("You are not authorized to update this job");
    }

    // ၄။ Update လုပ်ခြင်း
    const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        updateJob,
    });
};

// ====== DELETE JOB ======
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    // ၁။ Job ရှိ၊ မရှိ အရင်ရှာမယ်
    const job = await jobModel.findOne({ _id: id });

    if (!job) {
        return next(`No job found with this id ${id}`);
    }

    // ၂။ ပိုင်ရှင် ဟုတ်၊ မဟုတ် စစ်မယ်
    if (req.user.userId !== job.createdBy.toString()) {
        return next("You are not authorized to delete this job");
    }

    // ၃။ ဖျက်ထုတ်လိုက်မယ်
    await job.deleteOne();

    res.status(200).json({
        success: true,
        message: "Success, Job Deleted!",
    });
};



export const getAllJobsStatusController = async (req, res) => {
    // ၁။ Status အလိုက် တွက်ချက်ခြင်း
    let stats = await jobModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // stats array ကို object အဖြစ်ပြောင်းလဲပြီး default status သတ်မှတ်ခြင်း
    // အကယ်၍ DB မှာ data မရှိရင် အလိုအလျောက် 0 ပြပေးမှာဖြစ်ပါတယ်
    stats = stats.reduce((acc, curr) => {
        const { _id: key, count } = curr;
        acc[key] = count;
        return acc;
    }, {});

    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        reject: stats.reject || 0,
    };

    // ၂။ Monthly Applications ကို တွက်ချက်ခြင်း
    let monthlyApplications = await jobModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
    ]);

    // ၃။ Data format ပြောင်းခြင်း (Jan 2023 ပုံစံ)
    monthlyApplications = monthlyApplications.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format("MMM YYYY");
        return { date, count };
    }).reverse();

    // ၄။ အဖြေပြန်ထုတ်ပေးခြင်း
    res.status(200).json({
        totalJobs: Object.values(defaultStats).reduce((a, b) => a + b, 0), // စုစုပေါင်း အလုပ်အရေအတွက်
        defaultStats,
        monthlyApplications
    });
};