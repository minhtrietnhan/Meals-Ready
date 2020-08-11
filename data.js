var packages = [
  {
    name: "Chinese Cuisine Package Basic",
    image: "/img/chinese-cuisine.png",
    price: 42,
    noOfMeals: 3,
    category: ["spice", "asian"],
    description:
      "This is a basic Chinese Cuisine package for a day. It contains 3 meals packed with vibrant, delicous, fresh ingredients.",
    isTopPackage: true,
  },
  {
    name: "French Cuisine Package Basic",
    image: "/img/french-cuisine.png",
    price: 43,
    noOfMeals: 3,
    category: ["western", "elegant"],
    description:
      "This is starter French Cuisine package for a day. With 3 popular dishes of French cuisine packed for 3 different meals, quality and quantity is certified.",
    isTopPackage: true,
  },
  {
    name: "Japanese Cuisine Package Basic",
    image: "/img/japanese-cuisine.png",
    price: 43,
    noOfMeals: 3,
    category: ["asian", "vibrant"],
    description:
      "This is a basic combination of Japanese Cuisine for a day. Enjoy every meals with loads of surprise and explosion of taste. Made fresh to every ingredients.",
    isTopPackage: false,
  },
  {
    name: "Italian Cuisine Package Basic",
    image: "/img/italian-cuisine.png",
    price: 46,
    noOfMeals: 3,
    category: ["western"],
    description:
      "This is a basic combination of French Cuisine for a day. Traditional Italian meals made with fresh ingredients. Packed with love and flavour.",
    isTopPackage: true,
  },
];

module.exports.returnData = function () {
  return packages;
};

module.exports.addPackage = (data) => {
  return new Promise((resolve, reject) => {
    var error = {
      nameError: null,
      priceError: null,
      categoryError: null,
      noOfMealsError: null,
      descriptionError: null,
    };

    for (var key in data) {
      console.log(data[key]);
    }

    if (data.package_name == "") {
      error.nameError = "Please enter the name of the package!";
    }
    if (data.package_price == "") {
      error.priceError = "Please enter the price of the package!";
    }
    if (data.package_category == "") {
      error.priceError = "Please enter the category of the package!";
    }
    if (data.package_noofmeals == "") {
      error.noOfMealsError = "Please enter the number of meals in the package!";
    }
    if (data.package_description == "") {
      error.descriptionError = "Please enter the description of the package!";
    }

    // Reject if input data is not good
    for (var err in error) {
      if (error[err] != null) {
        return reject(error);
      }
    }

    // Data good
    var package = {
      name: data.package_name,
      image: `/img/${data.image}`,
      price: data.package_price,
      noOfMeals: data.package_noofmeals,
      category: data.package_category,
      description: data.package_description,
      isTopPackage: data.top_package == "on" ? true : false,
      meals: [],
    };

    packages.push(package);
    return resolve(package);
  });
};
