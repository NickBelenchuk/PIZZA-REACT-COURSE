import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { SearchContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination/Pagination';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort from '../components/Sort';

export const Home = () => {
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  // const categoryId = useSelector((state) => state.filter.categoryId);
  // const sortType = useSelector((state) => state.filter.sort.sortProperty);

  const [pizzas, setPizzas] = useState([]);
  const [loadSkeleton, setLoadSkeleton] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [categoryId, setcategoryId] = useState(0);
  // const [activeSort, setActiveSort] = useState(
  //   {
  //   name: 'по популярности',
  //   sort: 'rating'
  // });

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const { inputValue } = useContext(SearchContext);
  const PIZZAS_API = 'https://628d2158a3fd714fd03fbdba.mockapi.io/pizzas';

  const onChangePage = num => {
    dispatch(setCurrentPage(num))
  }


  useEffect(() => {
    setLoadSkeleton(true);

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'desc' : 'asc';
    const category = categoryId > 0 ? `&category=${categoryId}` : '';
    const search = inputValue ? `&search=${inputValue}` : '';
    const limitPizzas = `page=${currentPage}&limit=8`;

    // fetch(`${PIZZAS_API}?${limitPizzas}${category}&sortBy=${sortBy}&order=${order}${search}`)
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data) => {
    //     setPizzas(data);
    //     setLoadSkeleton(false);
    //   });
    axios
      .get(`${PIZZAS_API}?${limitPizzas}${category}&sortBy=${sortBy}&order=${order}${search}`)
      .then(res => {
        setPizzas(res.data);
        setLoadSkeleton(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, inputValue, currentPage]);

  const pizzaSearch = pizzas.map((items) => <PizzaBlock key={items.id} {...items} />);

  const skeletonDownload = [...new Array(8)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories categoryId={categoryId} onClickCategory={onClickCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{loadSkeleton ? skeletonDownload : pizzaSearch}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
