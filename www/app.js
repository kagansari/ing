import {Router} from '@vaadin/router';

import './components/navbar-element.js';
import './pages/employee-create-element.js';
import './pages/employee-edit-element.js';
import './pages/employees-list-element.js';
import './pages/not-found-element.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  {path: '/', component: 'employees-list-element'},
  {path: '/employees', component: 'employees-list-element'},
  {path: '/employees/new', component: 'employee-create-element'},
  {path: '/employees/:id', component: 'employee-edit-element'},
  {path: '(.*)', component: 'not-found-element'},
]);
