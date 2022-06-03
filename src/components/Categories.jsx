
function Categories({categoryId, onClickCategory}) {
  

  const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];


  return (
    <div className="categories">
      <ul>
        {categories.map((category, i) => (
          <li
            key={i}
            onClick={() => onClickCategory(i)}
            className={categoryId === i ? 'active' : ''}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
