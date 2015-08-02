$(function() {
	// пространство имён
	window.App = {
		Models: {},
		Collections: {},
		Views:{},
    get : function(url) {
       var data = "<h1> failed to load url : " + url + "</h1>";
       $.ajax({
           async: false,
           dataType: "text",
           url: url,
           success: function(response) {
               data = response;
           }
       });
       return data;
   }
	};

	// шаблон
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};

	App.Models.Task = Backbone.Model.extend({});

	App.Views.Task = Backbone.View.extend({
		tagName: 'li',
    template: _.template( App.get("template.html") ),
    initialize: function () {
        this.model.on('change', this.render, this);
				this.model.on('destroy', this.remove, this);
    },
    validate: function (attrs) {
    	if ( ! $.trim(attrs.title) ) {
    		return 'Имя задачи должно быть валидным!';
    	}
    },
		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html( template );
			return this;
		},
		remove:function(){
			this.$el.remove();
		},
		events:{
			'click .edit': 'editTask',
			'click .delete': 'deleteTask'
		},
		editTask: function  () {
			this.model.set('style', 'green');
			var newTaskTitle = prompt('Как переименуем задачу?', this.model.get('title'));
			this.model.set('title', newTaskTitle);
			this.model.set('style', 'red');
		},
		deleteTask: function(){
			this.model.destroy();
		}
	});

	App.Collections.Task = Backbone.Collection.extend({
		model: App.Models.Task
	});

	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',
		render: function() {
			this.collection.each(this.addOne, this);
			return this;
		},
		addOne: function(task) {
			// создавать новый дочерний вид
			var taskView = new App.Views.Task({ model: task });
			// добавлять его в корневой элемент
			this.$el.append(taskView.render().el);
		}
	})

	window.tasksCollection = new App.Collections.Task([
		{
			title: 'Сходить в магазин',
			style: 'red',
			priority: 4
		},
		{
			title: 'Получить почту!',
			style: 'red',
			priority: 3
		},
		{
			title: 'Сходить на работу',
			style: '',
			priority: 5
		},
	]);

	var tasksView = new App.Views.Tasks({ collection: tasksCollection});

	$('.tasks').html(tasksView.render().el);


});
