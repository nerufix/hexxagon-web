import { setCurrentPage } from "../ducks/actions"
import { connect } from "react-redux"
import { useRef } from "react"

function Pagination({elements, currentPage, setCurrentPage, ...props}) {

  const maxPageRecords = 10
  const pageCount = Math.ceil(elements.length/maxPageRecords)
  const startRef = useRef(null)

  const handlePageChange = (event) => {
    setCurrentPage(parseInt(event.target.id))
    startRef.current.scrollIntoView()   
  }

  return elements.length===0 ? <>{'No data!'}</> : (
    <div ref={startRef}>
      {elements.slice((currentPage-1)*maxPageRecords, currentPage*maxPageRecords)}
      <nav>
        <ul className="p-3 pagination">
          {
          currentPage<=2 || 
          <li className="page-item">
            <button className="d-inline page-link" id={1} onClick={handlePageChange}>
            {1}
            </button>
            <h3 className="m-1 text-primary d-inline">...</h3>
          </li>
          }
          {
          currentPage===1 || 
          <li className="page-item">
            <button className="page-link" id={currentPage-1} onClick={handlePageChange}>
            {currentPage-1}
            </button>
          </li>
          }
          <li className="page-item active">
            <button className="page-link text-white" id={currentPage} onClick={handlePageChange}>
            {currentPage}
            </button>
          </li>
          {
          currentPage===pageCount || 
          <li className="page-item">
            <button className="page-link" id={currentPage+1} onClick={handlePageChange}>
            {currentPage+1}
            </button>
          </li>
          }
          {
          currentPage>=pageCount-1 || 
          <li className="page-item">
            <h3 className="m-1 text-primary d-inline">...</h3>
            <button className="d-inline page-link" id={pageCount} onClick={handlePageChange}>
            {pageCount}
            </button>
          </li>
          }
        </ul>
      </nav>
    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    currentPage: state[props.entity].currentPage
  }
}

const mapDispatchToProps = {
  setCurrentPage
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination)
