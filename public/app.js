new Vue({
    el: '#app',
    data() {
      return {
        isDark: true,
        show: true,
        todoTitle: '',
        todos: []
      }
    },
    created(){
      const query = `
        query {
          getTodos {
            id title createdAt updatedAt
          }
        }
      `  
      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({query})
      })
      .then(res => res.json())
      .then(res => {
        this.todos = res.data.getTodos
      })
    },
    methods: {
      addTodo() {
        const title = this.todoTitle.trim()
        if (!title) {
          return
        }
        const query = `
          mutation {
            createTodo(todo: {title: "${title}"}){
              id title done createdAt updatedAt
            }
          }
        `
        fetch('/graphql', {
          method: 'post',
          headers: {'Content-type': 'application/json',
          'Accept': 'application/json'},
          body: JSON.stringify({query})
        })
          .then(res => res.json())
          .then((res) => {
            const todo = res.data.createTodo
            this.todos.push(todo)
            this.todoTitle = ''
          })
          .catch(e => console.log(e))
          
      },
      removeTodo(id) {
        fetch('/api/todo/' + id,{
          method: 'delete'
        })
        .then(() => {
          this.todos = this.todos.filter(t => t.id !== id)
        })
        .catch(e => console.log(e))
      },
      completeTodo(id){
        fetch('/api/todo/' + id, {
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({done: true})
        })
        .then(res => res.json())
        .then((todo) => {
          const index = this.todos.findIndex(t => t.id === todo.id)
          this.todos[index].updatedAt = todo.updatedAt
        })
        .catch(e => console.log(e))
      }
    },
    filters: {
      capitalize(value) {
        return value.toString().charAt(0).toUpperCase() + value.slice(1)
      },
      date(value, withTime) {
        const options = {
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        }
        if(withTime){
          options.hour = '2-digit'
          options.minute = '2-digit'
          options.second = '2-digit'
        }
        return new Intl.DateTimeFormat('ru-RU',options).format(new Date(+value))
      }
    }
  })