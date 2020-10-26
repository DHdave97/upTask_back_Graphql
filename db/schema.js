const {gql} = require('apollo-server')
const typeDefs= gql`
 
    type Query{
        obtenerProyectos:[Proyecto]
        obtenerTareas(input:ProyectoIDInput):[Tarea]
    }
    
    type Token{
        token:String
    }
    type Proyecto{
        nombre:String
        id:ID
    }
    type Tarea{
        nombre:String
        id:ID
        proyecto:String
        estado:Boolean
    }
    input ProyectoIDInput{
        proyecto:String
    }

    input UsuarioInput{
        nombre:String!
        email:String!
        password:String!
    }
    input AutenticarInput{
        email:String!
        password:String!
    }
   
    input ProyectoInput{
        nombre:String!
    }
    input TareaInput{
        nombre:String!
        proyecto:String
    }

    type Mutation{
        #usuarioS
        crearUsuario(input:UsuarioInput):String
        autenticarUsuario(input:AutenticarInput):Token

        #PROYECTOS
        nuevoProyecto(input:ProyectoInput):Proyecto
        actualizarProyecto(id:ID!,input:ProyectoInput):Proyecto
        eliminarProyecto(id:ID!):String

        #TAREAS
        nuevaTarea(input:TareaInput):Tarea
        actualizarTarea(id:ID!,input:TareaInput,estado:Boolean):Tarea
        eliminarTarea(id:ID!):String
    }
`;

module.exports = typeDefs