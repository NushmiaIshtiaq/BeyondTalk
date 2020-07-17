//Imports
import Storage from "../../util/minio";
import Employee from "../../db-schemas/employee.schema";

//Basic Information View start
const ViewProfile = (req, res) => {
  const { userid } = req.params;

  Employee.findOne({ userId: userid })
    .then(user => {
      return res.status(200).json({
        error: null,
        userData: user
      });
    })
    .catch(err => {
      return res.status(500).json({
        error: "Employee ID not Found",
        userData: null
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
    imagePath = `public/employee/${data.name}/profile.${image_meta.extension}`;
    const uploaded = await Storage.client.putObject(
      process.env.MINIO_BUCKET,
      imagePath,
      image,
      image_meta.size
    );
    if (!uploaded) {
      return res.status(500).json({
        error: "Customer Not Exist",
        updatedEmployee: null
      });
    }
  }

  const { userid } = req.params;
  let updateEmployee = {};
  if (image) {
    updateEmployee = {
      imageUrl: imagePath,
      name: data.name,
      contactNo: data.contactNo,
      mailingAddress: data.mailingAddress,
      permenantAddress: data.permenantAddress,
      age: data.age,
      cnic: data.cnic,
      designation: data.designation,
      gender: data.gender,
      joiningDate: data.joiningDate,
      about: data.about,
      updateProfile: true
    };
  } else {
    updateEmployee = {
      name: data.name,
      contactNo: data.contactNo,
      mailingAddress: data.mailingAddress,
      permenantAddress: data.permenantAddress,
      age: data.age,
      cnic: data.cnic,
      designation: data.designation,
      gender: data.gender,
      joiningDate: data.joiningDate,
      about: data.about,
      updateProfile: true
    };
  }

  Employee.findOneAndUpdate(
    { userId: userid },
    { $set: updateEmployee },
    { new: true }
  )
    .then(newEmployee => {
      if (newEmployee) {
        return res.status(200).json({
          error: null,
          updatedEmployee: newEmployee
        });
      } else {
        return res.status(500).json({
          error: "Employee Not Exist",
          updatedEmployee: null
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "Customer Id Not Exist",
        updatedEmployee: null
      });
    });
};
//Profile Information Update End

//Exports
export { ViewProfile, UpdateProfile };
