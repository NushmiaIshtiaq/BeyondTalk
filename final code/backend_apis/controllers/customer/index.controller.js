//Imports
import Customer from "../../db-schemas/customer.schema";
import Storage from "../../util/minio";

//Basic Information View start
const ViewProfile = (req, res) => {
  const { userid } = req.params;

  Customer.findOne({ userId: userid })
    .then((user) => {
      return res.status(200).json({
        error: null,
        userData: user,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Customer ID not Found",
        userData: null,
      });
    });
};
//Basic Information View End

//Profile Information Update start
const UpdateProfile = async (req, res) => {
  const data = await JSON.parse(req.body.data);

  const image_meta = data.image_meta;
  const image = req.files.image;

  let imagePath = "";

  if (image) {
    imagePath = `public/customer/${data.name}/profile.${image_meta.extension}`;
    const uploaded = await Storage.client.putObject(
      process.env.MINIO_BUCKET,
      imagePath,
      image,
      image_meta.size
    );
    if (!uploaded) {
      return res.status(500).json({
        error: "Customer Not Exist",
        updatedCustomer: null,
      });
    }
  }

  const { userid } = req.params;
  let updateCustomer = {};
  if (image) {
    updateCustomer = {
      imageUrl: imagePath,
      name: data.name,
      contactNo: data.contactNo,
      mailingAddress: data.mailingAddress,
      about: data.about,
      gender: data.gender,
      updateProfile: true,
    };
  } else {
    updateCustomer = {
      name: data.name,
      contactNo: data.contactNo,
      mailingAddress: data.mailingAddress,
      about: data.about,
      gender: data.gender,
      updateProfile: true,
    };
  }

  console.log(updateCustomer);
  Customer.findOneAndUpdate(
    { userId: userid },
    { $set: updateCustomer },
    { new: true }
  )
    .then((newCustomer) => {
      if (newCustomer) {
        return res.status(200).json({
          error: null,
          updatedCustomer: newCustomer,
        });
      } else {
        return res.status(500).json({
          error: "Customer Not Exist",
          updatedCustomer: null,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Customer Id Not Exist",
        updatedCustomer: null,
      });
    });
};
//Profile Information Update End

//Exports
export { ViewProfile, UpdateProfile };
