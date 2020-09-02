import {Moods, ProjectCategories, ThoughtCategories} from "./intefaces";

export class Select_options {
  allMoods: Moods[] =
    [{mood: 'Отличное'},
      {mood: 'Хорошее'},
      {mood: 'Среднее'},
      {mood: 'Плохое'},
      {mood: 'Очень плохое'}]

    projectCategories: ProjectCategories[] =
      [
        { p_category: 'Спорт'},
        { p_category: 'Здоровье'},
        { p_category: 'Хобби'},
        { p_category: 'Работа'},
        { p_category: 'Учеба'},
        { p_category: 'Личная жизнь'},
        { p_category: 'Психология'},
        { p_category: 'Саморазвитие'},
        { p_category: 'Семья'},
        { p_category: 'Развлечение'},
        { p_category: 'Отдых'},
        { p_category: 'Книги'},
        { p_category: 'Кино'},
        { p_category: 'Музыка'},
        { p_category: 'Дом'},
        { p_category: 'Уход за собой'},
        { p_category: 'Саморазвитие'},
        { p_category: 'Изучение иностранных языков'},
        { p_category: 'Кулинария'},
        { p_category: 'Рисование'},
        { p_category: 'Игры'},
        { p_category: 'Шоппинг'},
        { p_category: 'Путешествия'},
        { p_category: 'Друзья'},
        { p_category: 'Правильное питание'},
        { p_category: 'Посещение интересных мест'},
        { p_category: 'Развитие интеллектуальных способностей'},
        { p_category: 'Фотографии'},
        ]

    thoughtCategories: ThoughtCategories[]=[
      {t_category:'Философия'},
      {t_category:'Психология'},
      {t_category:'Отношения'},
      {t_category:'Сны'},
      {t_category:'Мнения о фильмах'},
      {t_category:'Мнения о книгах'},
      {t_category:'Саморазвитие'}
      ]
}
