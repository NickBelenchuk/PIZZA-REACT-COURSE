import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';

import { SearchContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination/Pagination';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort, { sortType } from '../components/Sort';

export const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const [pizzas, setPizzas] = useState([]);
  const [loadSkeleton, setLoadSkeleton] = useState(true);
  const { inputValue } = useContext(SearchContext);


  const PIZZAS_API = 'https://628d2158a3fd714fd03fbdba.mockapi.io/pizzas';

  const onClickCategory = (id) => {
    dispatch(setCategoryId(id));
  };


  const onChangePage = (num) => {
    dispatch(setCurrentPage(num));
  };

  const fetchPizzas = () => {
    setLoadSkeleton(true);

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'desc' : 'asc';
    const category = categoryId > 0 ? `&category=${categoryId}` : '';
    const search = inputValue ? `&search=${inputValue}` : '';
    const limitPizzas = `page=${currentPage}&limit=8`;

    axios
      .get(`${PIZZAS_API}?${limitPizzas}${category}&sortBy=${sortBy}&order=${order}${search}`)
      .then((res) => {
        setPizzas(res.data);
        setLoadSkeleton(false);
      });
  };

  // Якщо змінили параметри і відбувся перший рендер, то:
  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, inputValue, currentPage]);

  // Якщо був перший рендер, то перевіряємо URL- параметри і зберігаємо в REDUX
  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortType.find((obj) => obj.sortProperty === params.sortProperty);
      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true;
    }
  }, [categoryId, sort.sortProperty, inputValue, currentPage]);

  //Якщо був перший рендер, то робимо запит піц
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchPizzas();
    isSearch.current = false;
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
