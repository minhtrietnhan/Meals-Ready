module.exports.returnData = function () {
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
      meals: [
        {
          name: "Shrimp and Spinach Dimsum",
          price: 10,
          type: "Breakfast",
        },
        {
          name: "Fried noodles with Stir-fried Vegetables",
          price: 15,
          type: "Lunch",
        },
        {
          name: "Fried rice with General Tso's chicken",
          price: 17,
          type: "Dinner",
        },
      ],
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
      meals: [
        {
          name: "Fresh Baguette with Jam",
          price: 6,
          type: "Breakfast",
        },
        {
          name: "French Salad and Grilled Salmon with Black Beans",
          price: 22,
          type: "Lunch",
        },
        {
          name: "Coq au vin",
          price: 15,
          type: "Dinner",
        },
      ],
    },
    {
      name: "Japanese Cuisine Package Basic",
      image: "/img/japanese-cuisine.png",
      price: 43,
      noOfMeals: 3,
      category: ["asian", "vibrant"],
      description:
        "This is a basic combination of Japanese Cuisine for a day. Enjoy every meals with loads of surprise and explosion of taste. Made fresh to every ingredients.",
      isTopPackage: true,
      meals: [
        {
          name: "Steamed rice, Miso soup and Grilled Fish with side dishes",
          price: 10,
          type: "Breakfast",
        },
        {
          name: "Japanese Traditional Bento Box",
          price: 16,
          type: "Lunch",
        },
        {
          name: "Tokyo Ramen",
          price: 17,
          type: "Dinner",
        },
      ],
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
      meals: [
        {
          name: "Italian Baked Eggs and Sausages",
          price: 11,
          type: "Breakfast",
        },
        {
          name: "Bruschetta",
          price: 13,
          type: "Lunch",
        },
        {
          name: "Caprese Salad and Pasta Carbonara",
          price: 22,
          type: "Dinner",
        },
      ],
    },
  ];

  return packages;
};
