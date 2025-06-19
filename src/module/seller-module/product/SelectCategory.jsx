import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { getCategorySelect } from "../../../api/CategoryApi";
const SelectCategory = ({handleSelectCategory ,selectCategory}) => {

    const [category, setCategoy] = useState([])

    useEffect(() => {
        getCategorySelect().then((data) => {
          setCategoy(data)
        })
    },[])

    console.log((category));
    

    const handeleSelect = (e) => {
      console.log(e, 1);
      
    }

    
  return (
    
    <div>
      <Select
        isMulti
        name="colors"
        options={category}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleSelectCategory}
        
        // value={selectCategory.filter(category => selectedCategories.includes(category.value))}
        
      />
    </div>
  );
};

export default SelectCategory;
