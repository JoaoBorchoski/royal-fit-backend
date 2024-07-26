import { hash } from "bcrypt"
import { v4 as uuidV4 } from "uuid"

import createConnection from "../index"

async function create() {
  const connection = await createConnection()

  // block reasons

  await connection.query(
    `INSERT INTO block_reasons (
      id,
      code,
      description,
      instructions_to_solve,
      is_solved_by_password_reset,
      created_at,
      updated_at
    ) values 
      ('d79db0a2-5e8c-4fe6-81e0-5418cfa33c72', '001', 'Conta bloqueada por excesso de tentativas de acesso.', 'Use a opção de reset de senha.', true, 'now()', 'now()')`
  )

  // user groups

  await connection.query(
    `INSERT INTO user_groups (
      id,
      name,
      created_at,
      updated_at
    ) values 
      ('ca49908a-28cd-4573-808c-36c5f42a2e68', 'royalfit', 'now()', 'now()')`
  )

  // users

  const id = uuidV4()
  const password = await hash(btoa("admin"), 8)
  const password2 = await hash(btoa("royalfit"), 8)

  await connection.query(
    `INSERT INTO users (
      id, 
      user_group_id,
      name, 
      login, 
      password, 
      is_admin, 
      is_super_user, 
      must_change_password_next_logon,
      created_at,
      updated_at
    ) values (
      '${id}', 
      'ca49908a-28cd-4573-808c-36c5f42a2e68',
      'admin', 
      'admin@royalfitpg.com.br', 
      '${password}', 
      true, 
      true, 
      false,
      'now()', 
      'now()'
    ),(
      'd4f4b872-b273-49d1-856d-b2c415c2d860', 
      'ca49908a-28cd-4573-808c-36c5f42a2e68',
      'Royal Fit Diretor', 
      'diretor@royalfitpg.com.br', 
      '${password2}', 
      false, 
      false, 
      true,
      'now()', 
      'now()'
    )`
  )

  // modules

  await connection.query(
    `INSERT INTO modules (
      id,
      name,
      created_at,
      updated_at
    ) values 
      ('5aefe650-10a3-4e0d-a018-4704975d84b6', 'Segurança', 'now()', 'now()'),
			('aeb9e3cf-47fc-4aff-adf1-423570a9bf90', 'Tabelas', 'now()', 'now()'),
			('3bfc11ef-8ee3-44a6-87c1-589089adbc98', 'Cadastros', 'now()', 'now()'),
			('8e9568d3-dc76-44a9-8ca2-04c8ad85a527', 'Pedidos', 'now()', 'now()'),
			('483256d7-5011-4fb7-a0c6-27b1909bb154', 'Relatórios', 'now()', 'now()'),
			('a44a8034-e2ef-4b20-a226-ca981365baed', 'Clientes', 'now()', 'now()')`
  )

  // menu options

  await connection.query(
    `INSERT INTO menu_options (
      id,
      module_id,
      sequence,
      label,
      route,
      icon,
      key,
      created_at,
      updated_at
    ) values 
      ('ca49908a-28cd-4573-808c-36c5f42a2e68', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001', 'Segurança', '', 'fa-solid fa-lock', 'security', 'now()', 'now()'), 
      ('29d0a17a-d193-474b-8873-8e48b4ba700e', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001001', 'Motivos de Bloqueio', '/block-reasons', 'List', 'security-block-reasons', 'now()', 'now()'), 
      ('5185e703-21f1-4f53-9471-617b0dff8f73', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001002', 'Grupos de Usuários', '/user-groups', 'List', 'security-user-groups', 'now()', 'now()'), 
      ('2afd6619-ba71-447e-989e-76a4b21c8871', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001003', 'Usuários', '/users', 'List', 'security-users', 'now()', 'now()'), 
      ('d79db0a2-5e8c-4fe6-81e0-5418cfa33c72', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001004', 'Módulos', '/modules', 'List', 'security-modules', 'now()', 'now()'), 
      ('4b802ed3-b611-4067-8836-bab47b436cc4', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001005', 'Opções de Menu', '/menu-options', 'List', 'security-menu-options', 'now()', 'now()'), 
      ('2814da68-5179-4152-bd7e-22361b844b88', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001006', 'Perfis', '/profiles', 'List', 'security-profiles', 'now()', 'now()'), 
      ('b65f0fa5-27f5-498d-ba50-7008516bfcb9', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001007', 'Usuários x Perfis', '/users-profiles', 'List', 'security-users-profiles', 'now()', 'now()'), 
      ('0471bddc-de4c-42d1-a778-b67086796de1', '5aefe650-10a3-4e0d-a018-4704975d84b6', '001008', 'Navegação', '/navigations', 'List', 'security-navigations', 'now()', 'now()'),
			('1e2e60ff-1147-4251-bcd1-9d01dc337bca', 'aeb9e3cf-47fc-4aff-adf1-423570a9bf90', '002', 'Tabelas', '', 'fa-solid fa-table', 'comum', 'now()', 'now()'),
			('e528f448-a721-4289-8b84-c826fc34c211', 'aeb9e3cf-47fc-4aff-adf1-423570a9bf90', '002001', 'Países', '/paises', 'public', 'comum-paises', 'now()', 'now()'),
			('3b52505c-c53c-4d83-92b1-1006237fa5a4', 'aeb9e3cf-47fc-4aff-adf1-423570a9bf90', '002002', 'Estados', '/estados', 'public', 'comum-estados', 'now()', 'now()'),
			('be254917-b7a3-4df2-b527-7b84a77cb3d4', 'aeb9e3cf-47fc-4aff-adf1-423570a9bf90', '002003', 'Cidades', '/cidades', 'apartment', 'comum-cidades', 'now()', 'now()'),
			('95ad62a0-ca6e-4093-bad9-8b7b78abb5e5', 'aeb9e3cf-47fc-4aff-adf1-423570a9bf90', '002004', 'CEP', '/ceps', 'groups', 'comum-ceps', 'now()', 'now()'),
			('d004dea9-c11b-4741-b9b2-f313b9f8dbff', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003', 'Cadastros', '', 'fa-solid fa-gear', 'cadastros', 'now()', 'now()'),
			('7a08ced8-f89b-44e9-8d86-bfb9bfddcbd8', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003001', 'Funcionarios', '/funcionarios', 'factory', 'cadastros-funcionarios', 'now()', 'now()'),
			('6b631c83-8923-4de3-a75b-54aa7e80c8b8', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003002', 'Clientes', '/clientes', 'sell', 'cadastros-clientes', 'now()', 'now()'),
			('9af78950-b778-4bc1-92b1-88100e625d0b', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003003', 'Produtos', '/produtos', 'List', 'cadastros-produtos', 'now()', 'now()'),
			('635416f2-a510-4ea5-8a20-99375a4d07b0', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003004', 'Estoques', '/estoques', 'List', 'cadastros-estoques', 'now()', 'now()'),
			('921db32f-3d57-4603-9fd5-eeef564f8916', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003005', 'Garrafões', '/garrafoes', 'List', 'cadastros-garrafoes', 'now()', 'now()'),
			('c287d4db-8546-44fe-acfb-bdec5e279367', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003006', 'Meio de Pagamento', '/meios-pagamento', 'List', 'cadastros-meios-pagamento', 'now()', 'now()'),
			('e4cb2675-9a6f-4241-84a6-0e5896f6df2d', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003007', 'Status de Pagamento', '/status-pagamento', 'List', 'cadastros-status-pagamento', 'now()', 'now()'),
			('3719edab-1310-4406-ab8a-b0ae1c81e662', '3bfc11ef-8ee3-44a6-87c1-589089adbc98', '003008', 'Bonificacões', '/bonificacoes', 'List', 'cadastros-bonificacoes', 'now()', 'now()'),
			('ad07130b-63eb-4563-80ff-6ddcf98883e7', '8e9568d3-dc76-44a9-8ca2-04c8ad85a527', '004', 'Pedidos', '', 'fa-solid fa-clipboard', 'pedido', 'now()', 'now()'),
			('2a7a3210-1abf-4716-bf02-8249421dae5f', '8e9568d3-dc76-44a9-8ca2-04c8ad85a527', '004001', 'Pedidos', '/pedidos', 'sell', 'pedido-pedidos', 'now()', 'now()'),
			('e205a1bc-bf90-40c3-97a1-5117be01dd10', '483256d7-5011-4fb7-a0c6-27b1909bb154', '005', 'Relatorios', '', 'fa-solid fa-file', 'relatorios', 'now()', 'now()'),
			('3d06e43e-ce88-4fe8-8e8e-83c8398bbb20', '483256d7-5011-4fb7-a0c6-27b1909bb154', '005002', 'Relatórios Funcionarios', '/relatorios-funcionarios', 'List', 'relatorios-relatorios-funcionarios', 'now()', 'now()'),
			('bc22a6aa-1a3a-4c67-8ae5-c2f13d0da978', 'a44a8034-e2ef-4b20-a226-ca981365baed', '006', 'Clientes', '', 'fa-solid fa-user', 'clientes', 'now()', 'now()'),
			('7e10b4b1-c3a4-4aad-83b4-47c64671aeaa', 'a44a8034-e2ef-4b20-a226-ca981365baed', '006001', 'Balanços Clientes', '/balancos', 'List', 'clientes-balancos', 'now()', 'now()')`
  )

  // profiles

  await connection.query(
    `INSERT INTO profiles (
      id,
      user_group_id,
      name,
      created_at,
      updated_at
    ) values 
      ('3c99decf-f975-4b16-b552-0747afd397a3', 'ca49908a-28cd-4573-808c-36c5f42a2e68', 'Admin', 'now()', 'now()'),
      ('04297a01-7c84-45f7-9485-95df65e8fd78', 'ca49908a-28cd-4573-808c-36c5f42a2e68', 'Diretor', 'now()', 'now()')`
  )

  // profile options

  await connection.query(
    `INSERT INTO profile_options (
      id,
      profile_id,
      menu_option_key,
      permit_all,
      created_at,
      updated_at
    ) values 
      ('ca49908a-28cd-4573-808c-36c5f42a2e68', '3c99decf-f975-4b16-b552-0747afd397a3', 'security', true, 'now()', 'now()'),
      ('29d0a17a-d193-474b-8873-8e48b4ba700e', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-block-reasons', true, 'now()', 'now()'),
      ('5185e703-21f1-4f53-9471-617b0dff8f73', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-user-groups', true, 'now()', 'now()'),
      ('2afd6619-ba71-447e-989e-76a4b21c8871', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-users', true, 'now()', 'now()'),
      ('d79db0a2-5e8c-4fe6-81e0-5418cfa33c72', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-modules', true, 'now()', 'now()'),
      ('4b802ed3-b611-4067-8836-bab47b436cc4', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-menu-options', true, 'now()', 'now()'),
      ('2814da68-5179-4152-bd7e-22361b844b88', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-profiles', true, 'now()', 'now()'),
      ('b65f0fa5-27f5-498d-ba50-7008516bfcb9', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-users-profiles', true, 'now()', 'now()'),
      ('0471bddc-de4c-42d1-a778-b67086796de1', '3c99decf-f975-4b16-b552-0747afd397a3', 'security-navigations', true, 'now()', 'now()'),
			('e03faeec-2711-4a79-a382-13dc5e327e92', '3c99decf-f975-4b16-b552-0747afd397a3', 'comum', true, 'now()', 'now()'),
			('9dcfdf1d-aea9-462c-bb0c-d90767e6c81a', '3c99decf-f975-4b16-b552-0747afd397a3', 'comum-paises', true, 'now()', 'now()'),
			('c9cb2f0a-cca1-4900-81d8-590eea4034e7', '3c99decf-f975-4b16-b552-0747afd397a3', 'comum-estados', true, 'now()', 'now()'),
			('f9c6ada2-60da-4784-9141-a2a37fc80256', '3c99decf-f975-4b16-b552-0747afd397a3', 'comum-cidades', true, 'now()', 'now()'),
			('89633f99-9027-4021-ae06-9344daa3a9db', '3c99decf-f975-4b16-b552-0747afd397a3', 'comum-ceps', true, 'now()', 'now()'),
			('b751887e-8b40-4ed9-aaf7-218aca95e728', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros', true, 'now()', 'now()'),
			('624679a2-b4b4-47c7-ad1f-d51830ef300d', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-funcionarios', true, 'now()', 'now()'),
			('2c81e2e5-e1c8-4cc6-b5be-a6bed5e2bee4', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-clientes', true, 'now()', 'now()'),
			('e9dd8ea4-d7ac-4512-98cb-1ac1918748d3', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-produtos', true, 'now()', 'now()'),
			('c9415986-f58e-49d7-a40e-fadb4bb051c4', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-estoques', true, 'now()', 'now()'),
			('99bfda37-fd0e-4cfc-b730-07af90023c34', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-garrafoes', true, 'now()', 'now()'),
			('f7af98f8-daf7-4a36-b43a-b6f170fa03f8', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-meios-pagamento', true, 'now()', 'now()'),
			('4192ca2d-46e7-4172-9acc-bb0b13d4a5ea', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-status-pagamento', true, 'now()', 'now()'),
			('0516f415-05cd-4bd5-8028-f925b6b8b3be', '3c99decf-f975-4b16-b552-0747afd397a3', 'cadastros-bonificacoes', true, 'now()', 'now()'),
			('82e764c9-63de-404d-b831-64ec274d854a', '3c99decf-f975-4b16-b552-0747afd397a3', 'pedido', true, 'now()', 'now()'),
			('2e244e99-88f5-4003-90dc-667de2aeac10', '3c99decf-f975-4b16-b552-0747afd397a3', 'pedido-pedidos', true, 'now()', 'now()'),
			('9a2ebadd-27a9-4c5c-9902-5bc012e2c4c3', '3c99decf-f975-4b16-b552-0747afd397a3', 'relatorios', true, 'now()', 'now()'),
			('359003d8-89d5-444f-84b7-6b15213f8d49', '3c99decf-f975-4b16-b552-0747afd397a3', 'relatorios-relatorios-funcionarios', true, 'now()', 'now()'),
			('47ae8dd6-98be-4a07-a983-652362a78439', '3c99decf-f975-4b16-b552-0747afd397a3', 'clientes', true, 'now()', 'now()'),
			('0c2286a8-6799-4cea-81d6-f0992b401d3c', '3c99decf-f975-4b16-b552-0747afd397a3', 'clientes-balancos', true, 'now()', 'now()'),
      ('ec4c0d98-52ac-4140-980d-0bcb88190cf6', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros', true, 'now()', 'now()'),
      ('d0b71b84-4b5f-4367-9704-d5590c9a1fd6', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-funcionarios', true, 'now()', 'now()'),
			('11272bcb-5301-4dbd-9119-694958c53d1f', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-clientes', true, 'now()', 'now()'),
			('2ed7ee82-2fd2-4cb0-9851-7199923ff15f', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-produtos', true, 'now()', 'now()'),
      ('57a46e73-d58b-417e-a7cc-350807b57c8c', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-estoques', true, 'now()', 'now()'),
			('fa7e4acd-8f93-41b7-9a94-488a316fbadb', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-garrafoes', true, 'now()', 'now()'),
			('dd5a31a8-c139-4d2c-95c6-5eb594efac04', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-meios-pagamento', true, 'now()', 'now()'),
			('8380b3c2-04d6-4d1a-bb7e-f8c32cfc792b', '04297a01-7c84-45f7-9485-95df65e8fd78', 'cadastros-bonificacoes', true, 'now()', 'now()'),
      ('2f0fd867-1c33-423e-a162-b1e50c016c4c', '04297a01-7c84-45f7-9485-95df65e8fd78', 'pedido', true, 'now()', 'now()'),
			('e333006e-62ab-4ddd-9e63-6918a3615bf2', '04297a01-7c84-45f7-9485-95df65e8fd78', 'pedido-pedidos', true, 'now()', 'now()'),
      ('3265fe5a-eaf7-4e6e-ac35-1d572bd7869d', '04297a01-7c84-45f7-9485-95df65e8fd78', 'relatorios', true, 'now()', 'now()'),
			('ac86fd1f-5bb9-48ab-a8d0-e90e52eac5c2', '04297a01-7c84-45f7-9485-95df65e8fd78', 'relatorios-relatorios-funcionarios', true, 'now()', 'now()'),
      ('10193daf-1cb2-48c0-ae2d-59cb78d84129', '04297a01-7c84-45f7-9485-95df65e8fd78', 'clientes', true, 'now()', 'now()'),
			('9d79a096-b2e9-49db-8de4-bbf94c44e50b', '04297a01-7c84-45f7-9485-95df65e8fd78', 'clientes-balancos', true, 'now()', 'now()'),
      ('0d8dfdcc-e8ba-437c-819c-6dbe0a1a027b', '04297a01-7c84-45f7-9485-95df65e8fd78', 'security', true, 'now()', 'now()'),
      ('8ce2943f-7a7f-4d57-9113-930f5bd3c505', '04297a01-7c84-45f7-9485-95df65e8fd78', 'security-profiles', true, 'now()', 'now()')`
  )

  // user x profile

  await connection.query(
    `INSERT INTO users_profiles (
      id,
      user_id,
      profile_id,
      created_at,
      updated_at
      ) values 
      ('4b802ed3-b611-4067-8836-bab47b436cc4', '${id}', '3c99decf-f975-4b16-b552-0747afd397a3', 'now()', 'now()'),
      ('86469de3-39a9-448e-a68e-f578fce3bb46', 'd4f4b872-b273-49d1-856d-b2c415c2d860', '04297a01-7c84-45f7-9485-95df65e8fd78', 'now()', 'now()')`
  )

  // configs

  await connection.query(
    `INSERT INTO configs (
      id,
      title,
      description,
      created_at,
      updated_at
    ) values 
      ('62e4bde6-56f0-4dae-b06a-c3ffcbd58047', 'email', '{"service":"gmail","smtpHost":"smtp.gmail.com","smtpPort":587,"smtpUser":"desenvweb@vamilly.com.br","smtpPass":"NCjEr<N39AUb3bC<"}', 'now()', 'now()')`
  )

  await connection.query(
    `INSERT INTO meios_pagamento (
      id, 
      nome, 
      descricao,
      created_at,
      updated_at
    ) values 
      ('ee350922-4185-4fc0-8537-d8a8c4ffdd47', 'Pix', 'Pix', 'now()', 'now()'),
      ('ea1fc3d7-2ec6-4a7e-8094-99a84131a2b8', 'Dinheiro', 'Dinheiro', 'now()', 'now()'),
      ('5b01ebad-bb41-4d14-a8b6-cac7a323c166', 'Débito', 'Débito', 'now()', 'now()'),
      ('e0b93204-c115-4129-b788-365797db3c84', 'Cheque', 'Cheque', 'now()', 'now()'),
      ('b5dc109d-88db-442c-b33e-0fcafad9ebf0', 'Crédito 1X', 'Crédito 1X', 'now()', 'now()'),
      ('e2c55718-9589-4e88-83c3-c95a739c5088', 'Crédito 2X', 'Crédito 2X', 'now()', 'now()'),
      ('ef5a1b5b-e34b-43c8-84d6-87e24e57c045', 'Crédito 3X', 'Crédito 3X', 'now()', 'now()'),
      ('d67f0df4-566a-46ba-b25f-206aa8932211', 'Crédito 6X', 'Crédito 6X', 'now()', 'now()'),
      ('9751732c-4ed8-465f-96f1-2d2580b33a5d', 'Crediário Próprio', 'Crediário Próprio', 'now()', 'now()')`
  )

  await connection.query(
    `INSERT INTO status_pagamento (
      id,
      nome,
      descricao,
      created_at,
      updated_at
    ) values 
      ('2798a92f-3412-4ed3-934d-e1209bbad87f', 'Pagamento Imediato', 'Pagamento Imediato', 'now()', 'now()'),
      ('58922f62-67e4-4f50-8e0d-2bcb89f95f9a', 'Pagamento Posterior', 'Pagamento Posterior', 'now()', 'now()')`
  )

  await connection.close()
}

export async function admin() {
  await create().then(() => console.log("Admin and Security tables created!"))
}
