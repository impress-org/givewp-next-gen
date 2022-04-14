export default ( props ) => ( 'development' === process.env.NODE_ENV ) ? console.log( props ) : null
