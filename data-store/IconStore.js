import React from "react";
import { Image, Text } from "react-native";

const iconMap = {
  placeholder: [
    {
      id: 0,
      sourceWhite: require("../assets/images/product-icons/placeholder/placeholder-white.png"),
      sourceBlack: require("../assets/images/product-icons/placeholder/placeholder-black.png")
    }
  ],
  beverage: [
    {
      id: 0,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-1-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-1-black.png")
    },
    {
      id: 1,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-2-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-2-black.png")
    },
    {
      id: 2,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-3-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-3-black.png")
    },
    {
      id: 3,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-4-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-4-black.png")
    },
    {
      id: 4,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-5-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-5-black.png")
    },
    {
      id: 5,
      sourceWhite: require("../assets/images/product-icons/beverage/cup-takeaway-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/cup-takeaway-black.png")
    },
    {
      id: 6,
      sourceWhite: require("../assets/images/product-icons/beverage/drink-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/drink-black.png")
    },
    {
      id: 7,
      sourceWhite: require("../assets/images/product-icons/beverage/drink-ice-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/drink-ice-black.png")
    },
    {
      id: 8,
      sourceWhite: require("../assets/images/product-icons/beverage/drink-can-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/drink-can-black.png")
    },
    {
      id: 9,
      sourceWhite: require("../assets/images/product-icons/beverage/glass-1-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/glass-1-black.png")
    },
    {
      id: 10,
      sourceWhite: require("../assets/images/product-icons/beverage/glass-2-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/glass-2-black.png")
    },
    {
      id: 11,
      sourceWhite: require("../assets/images/product-icons/beverage/glass-3-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/glass-3-black.png")
    },
    {
      id: 12,
      sourceWhite: require("../assets/images/product-icons/beverage/glass-4-white.png"),
      sourceBlack: require("../assets/images/product-icons/beverage/glass-4-black.png")
    }
  ],
  food: [
    {
      // Generic food
      id: 0,
      sourceWhite: require("../assets/images/product-icons/food/pizza-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/pizza-black.png")
    },
    {
      id: 1,
      sourceWhite: require("../assets/images/product-icons/food/pizza-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/pizza-black.png")
    },
    {
      id: 2,
      sourceWhite: require("../assets/images/product-icons/food/burger-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/burger-black.png")
    },
    {
      id: 3,
      sourceWhite: require("../assets/images/product-icons/food/rice-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/rice-black.png")
    },
    {
      id: 4,
      sourceWhite: require("../assets/images/product-icons/food/noodles-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/noodles-black.png")
    },
    {
      id: 5,
      sourceWhite: require("../assets/images/product-icons/food/sushi-white.png"),
      sourceBlack: require("../assets/images/product-icons/food/sushi-black.png")
    }
  ]
};

class iconStore {
  getIcon(iconJson, style, light) {
    if (iconJson) {
      const iconObject = JSON.parse(iconJson);

      const category = iconObject.cat;
      const id = iconObject.id;

      if (category && typeof id === "number") {
        const srcArray = iconMap[category];

        const src = srcArray.find(arr => {
          return arr.id === id;
        });

        if (light) {
          return <Image style={style} source={src.sourceWhite} />;
        } else {
          return <Image style={style} source={src.sourceBlack} />;
        }
      } else {
        return returnPlaceholder(style, light);
      }
    } else {
      return returnPlaceholder(style, light);
    }
  }

  getAll(light) {
    return iconMap;
  }
}

const returnPlaceholder = (style, light) => {
  if (light) {
    return <Image style={style} source={iconMap.placeholder[0].sourceWhite} />;
  } else {
    return <Image style={style} source={iconMap.placeholder[0].sourceBlack} />;
  }
};

const IconStore = new iconStore();
export default IconStore;
