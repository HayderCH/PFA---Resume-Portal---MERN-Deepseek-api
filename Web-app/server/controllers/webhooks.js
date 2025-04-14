/*import { Webhook } from "svix";
import User from "../models/User.js";

// API controller function to manage clerk user with Database
export const clerkWebhooks = async (req,res) =>{

    try {
        
        //create svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        //verifying headers
        await whook.verify(JSON.stringify(req.body),{
            "svix-id" : req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        //getting data from request body
        const {data, type} = req.body

        //switch case for different events
        switch (type) {
            case 'user.created':{

                const userData = {
                    _id:data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name+" "+data.last_name,
                    image : data.image_url,
                    resume: ''
                }
                await User.create(userData)
                res.json({})
                break;

            }
            case 'user.updated':{

                const userData = {
                    
                    email: data.email_addresses[0].email_address,
                    name: data.first_name+" "+data.last_name,
                    image : data.image_url,
                     
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
                
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }

    } catch (error) {
        console.log(error.messge)
        res.json({success:false,message:'Webhooks Error.'})
    }
*/
import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString(); // Convert raw Buffer to string

    console.log("Received Payload:", payload);  // Log the raw payload for debugging

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    console.log("Received Headers:", req.headers);
console.log("Received Payload:", req.body);

const isVerified = wh.verify(payload, headers);
if (!isVerified) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
}

    const { data, type } = event;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: ""
        };
        const existingUser = await User.findById(data.id);
        if (!existingUser) {
            await User.create(userData);
        } else {
            console.log("User already exists:", data.id);
        }
        
        return res.status(201).json({ success: true });
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url
        };
        await User.findByIdAndUpdate(data.id, updatedData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Webhook error:", error.stack);
    return res.status(400).json({ success: false, message: "Webhook error" });
  }
};
