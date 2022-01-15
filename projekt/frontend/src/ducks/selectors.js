//to fix
export const selectRecents = (state) => {
  const {byId, allIds} = state.entities.movies
  return allIds.sort((a, b) => (
    new Date(byId[b].release_date) - new Date(byId[a].release_date)
  )).slice(0, 3)
}

export const selectMoviesMostActors = (state) => {
  const {byId, allIds} = state.entities.movies
  return allIds.filter(el => byId[el].actors).sort((a, b) => (
    byId[b].actors.length-byId[a].actors.length
  ))
}

export const selectActorsMostMovies = (state) => {
  const {byId, allIds} = state.entities.movies
  const actorsCombined = allIds.filter(el => byId[el].actors).reduce((acc, a) => (
    [...acc, ...byId[a].actors]
  ), [])
  const sorted = Array.from(new Set(actorsCombined)).sort((a, b) => (
    actorsCombined.filter(el => el===b).length-actorsCombined.filter(el => el===a).length
  ))
  return [...sorted, ...state.entities.persons.allIds.filter(el => !sorted.includes(el))]
}

export const selectPeopleByNationality = (state) => {
  const {byId, allIds} = state.entities.persons
  const nationalitiesCombined = allIds.map(el => byId[el].nationality)
  return Array.from(new Set(nationalitiesCombined)).reduce((acc, a) => ({
    nationality: [...acc.nationality, a],
    count: [...acc.count, nationalitiesCombined.filter(el => a === el).length]
  }), {nationality: [], count: []})
}

export const selectMoviesByYear = (state) => {
  const {byId, allIds} = state.entities.movies
  const yearsCombined = allIds.map(el => parseInt(byId[el].release_date.slice(0,4)))
  const minYear = yearsCombined.length>0 ? Math.min(...yearsCombined) : 2021
  return [...Array(new Date().getFullYear()-minYear+1).keys()].reduce((acc, a) => ({
    year: [...acc.year, minYear+a],
    count: [...acc.count, yearsCombined.filter(el => minYear+a === el).length]
  }), {year: [], count: []})
}

export const selectStatus = (state) => {
  const foundStatus = Object.entries(state.entities).find(([k, v]) => v.status)
  return foundStatus ? foundStatus[1].status : foundStatus
}

export const selectMoviesByActor = (state, actorId) => {
  return Object.values(state.entities.movies.byId).filter(el => el.actors.includes(parseInt(actorId)))
}

export const selectMoviesByDirector = (state, directorId) => {
  return Object.values(state.entities.movies.byId).filter(el => el.director_id === parseInt(directorId))
}