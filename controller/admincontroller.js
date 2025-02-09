module.exports={
formPost: async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { name, price } = req.body;
  const filename = req.file.filename;
  console.log(filename);

  // Create and save the new product
  const newProduct = new product({
    name,
    price,
    imglink: filename,
  });
  
  await newProduct.save();
  const user = await Signup.findOne(); // Find a user, assuming we are notifying the first one, modify based on your needs
  user.notification.push({
    message: `New product added: ${name}`,
  });
  
  await user.save(); // Save the updated user

  res.status(200).json({ message: "Product added and notification sent!" });
}
}