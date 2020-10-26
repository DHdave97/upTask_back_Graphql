
const Usuario = require('../models/usuario')
const Proyecto = require('../models/proyecto')
const Tarea = require('../models/tarea')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'variables.env'})
//crear token
const crearToken =(usuario,secreta,expiresIn)=>{
    const { id,email,nombre} = usuario
    return jwt.sign({id,email,nombre},secreta,{expiresIn})
}

const resolvers = {
    Query:{
        obtenerProyectos:async(_,{},ctx)=>{
            const proyectos = await Proyecto.find({creador:ctx.usuario.id})
            return proyectos
        },
        obtenerTareas:async(_,{input},ctx)=>{
            console.log("recbo input",input)
            const tareas = await Tarea.find({creador:ctx.usuario.id}).where('proyecto').equals(input.proyecto)
            return tareas
        }
    },
    Mutation:{
        crearUsuario :async(_,{input})=>{
            const {nombre,password,email} = input
            const existeUsuario = await Usuario.findOne({email})
            //si existe 
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado')
            }
            try {
                //hashear pass
                const salt = await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password,salt)
                //registro
                const nuevoUsuario = new Usuario(input)
                nuevoUsuario.save()
                return "Usuario creado correctamente"
            } catch (error) {
                console.log(error)
            }
        },
        autenticarUsuario:async(_,{input})=>{
            const {password,email} = input

            //existe usuario
            const existeUsuario = await Usuario.findOne({email})
            if(!existeUsuario) throw new Error('El usuario no esta registrado')
               
            //pass correct
            const passCorrect = await bcryptjs.compare(password,existeUsuario.password)
            if(!passCorrect) throw new Error('Password incorrecto')

            //dar acceso
            return {
                token:crearToken(existeUsuario,process.env.SECRETA,'4hr')
            }

        },
        nuevoProyecto:async(_,{input},ctx)=>{
            try {
                const proyecto = new Proyecto(input)
                proyecto.creador = ctx.usuario.id
                const resultado = await proyecto.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarProyecto:async(_,{id,input},ctx)=>{
            //exite proyecto
            let proyecto = await Proyecto.findById(id)
            if(!proyecto) throw new Error('No existe el proyecto')
            //duenio del proyecto
            if(proyecto.creador.toString() !== ctx.usuario.id)throw new Error('No tienes permiso para editar')

            //actualizar
            proyecto = await Proyecto.findOneAndUpdate({_id:id},input,{new:true})
            return proyecto
        },
        eliminarProyecto:async(_,{id},ctx)=>{
            //exite proyecto
            let proyecto = await Proyecto.findById(id)
            if(!proyecto) throw new Error('No existe el proyecto')
            //duenio del proyecto
            if(proyecto.creador.toString() !== ctx.usuario.id)throw new Error('No tienes permiso para eliminar')

            //eliminar
            await Proyecto.findOneAndDelete({_id:id})
            return "Proyecto eliminado"
        },

        //TAREAS
        nuevaTarea:async(_,{input},ctx)=>{
            try {
                const tarea = new Tarea(input)
                tarea.creador = ctx.usuario.id
                const resultado = await tarea.save()
                return resultado
            } catch (error) {
                console.log(error)
            }
        },
        actualizarTarea:async(_,{id,input,estado},ctx)=>{
            //exite tarea
            console.log("recibo tarea,: ",id,input,estado)
            let tarea = await Tarea.findById(id)
            if(!tarea) throw new Error('No existe la tarea')
            //duenio de la tarea
            if(tarea.creador.toString() !== ctx.usuario.id)throw new Error('No tienes permiso para editar la tarea')
            input.estado = estado
            //actualizar
            tarea = await Tarea.findOneAndUpdate({_id:id},input,{new:true})
            return tarea
        },
        eliminarTarea:async(_,{id},ctx)=>{
            //exite tarea
            let tarea = await Tarea.findById(id)
            if(!tarea) throw new Error('No existe la tarea')
            //duenio de la tarea
            if(tarea.creador.toString() !== ctx.usuario.id)throw new Error('No tienes permiso para eliminar')

            //eliminar
            await Tarea.findOneAndDelete({_id:id})
            return "Tarea eliminada"
        },
    }
}

module.exports =resolvers