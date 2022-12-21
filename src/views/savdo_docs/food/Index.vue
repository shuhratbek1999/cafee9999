<template>
  <!--Add product start-->
  <n-modal
    v-model:show="showAddProduct"
    preset="dialog"
    title="Xomashyo"
    :on-after-leave="leaveProduct"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input
          v-model:value="create_product.name"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vProduct$.name.$error">
            {{ vProduct$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Birlikni tanlang</p>
        <div style="display: flex">
          <n-select
            :options="measures"
            v-model:value="create_product.measure_id"
            filterable
            placeholder="Tanlang"
          >
            <template #empty> Ma'lumotlar topilmadi 🙁 </template>
          </n-select>
          <n-button @click="showChooseMeasure = true">...</n-button>
        </div>
        <small>
          <n-gradient-text type="error" v-if="vProduct$.measure_id.$error">
            {{ vProduct$.measure_id.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Sotib olish narxi</p>
        <n-input
          v-model:value="create_product.purchase_price"
          placeholder="Kiriting"
          type="number"
        />
        <small>
          <n-gradient-text type="error" v-if="vProduct$.purchase_price.$error">
            {{ vProduct$.purchase_price.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createProduct">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <!--Add product end-->
  <!--choose product start-->
  <n-modal v-model:show="showChooseProduct">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddProduct">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchProduct"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal"
        :data="foodResources"
        ref="productRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsProduct"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--choose product end-->
  <!--Add chief start-->
  <n-modal
    v-model:show="showAddChief"
    preset="dialog"
    title="Oshpaz"
    :on-after-leave="leaveChief"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Username</p>
        <n-input
          v-model:value="create_chief.username"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vChief$.username.$error">
            {{ vChief$.username.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Password</p>
        <n-input v-model:value="create_chief.password" placeholder="Kiriting" />
        <small>
          <n-gradient-text type="error" v-if="vChief$.password.$error">
            {{ vChief$.password.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Email</p>
        <n-input
          v-model:value="create_chief.email"
          placeholder="Kiriting"
          type="email"
        />
        <small>
          <n-gradient-text type="error" v-if="vChief$.email.$error">
            {{ vChief$.email.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createChief">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <!--Add chief end-->
  <!--Choose chief start-->
  <n-modal v-model:show="showChooseChief">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddChief">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchChief"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal2"
        :data="chiefs"
        ref="chiefRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsChief"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--Choose chief end-->
  <!--Add printer start-->
  <n-modal
    v-model:show="showAddPrinter"
    preset="dialog"
    title="Printer"
    :on-after-leave="leavePrinter"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input v-model:value="create_printer.name" placeholder="Kiriting" />
        <small>
          <n-gradient-text type="error" v-if="vPrinter$.name.$error">
            {{ vPrinter$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">IP</p>
        <n-input v-model:value="create_printer.ip" placeholder="Kiriting" />
        <small>
          <n-gradient-text type="error" v-if="vPrinter$.ip.$error">
            {{ vPrinter$.ip.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createPrinter">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <!--Add printer end-->
  <!--Choose printer start-->
  <n-modal v-model:show="showChoosePrinter">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddPrinter">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchPrinter"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal"
        :data="loadPrinters"
        ref="printerRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsPrinter"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--Choose printer end-->
  <!--Add food disturbute start-->
  <n-modal
    v-model:show="showAddFoodDisturbute"
    preset="dialog"
    title="Ovqat disturbute"
    :on-after-leave="leaveFoodDisturbuteAdd"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input
          v-model:value="create_food_disturbute.name"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vFoodDisturbute$.name.$error">
            {{ vFoodDisturbute$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <n-form-item label="Menyuda chiqarish" style="font-weight: bold">
        <n-switch
          v-model:value="create_food_disturbute.showMenu"
          checked-value="1"
          unchecked-value="0"
        />
      </n-form-item>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createFooddistrubute">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <!--Add food disturbute end-->
  <!--choose food disturbute start-->
  <n-modal v-model:show="showChooseFoodDisturbute">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddFoodDisturbute">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchFoodDisturbute"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal"
        :data="loadFdistrubute"
        ref="foodDisturbuteRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsFoodDisturbute"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--choose food disturbute end-->
  <!--Add food group start-->
  <n-modal
    v-model:show="showAddFoodGroup"
    preset="dialog"
    title="Ovqat group"
    :on-after-leave="leaveFoodGroupAdd"
  >
    <n-form>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Name</p>
        <n-input
          v-model:value="create_food_group.name"
          placeholder="Kiriting"
          ref="firstInput"
        />
        <small>
          <n-gradient-text type="error" v-if="vFoodGroup$.name.$error">
            {{ vFoodGroup$.name.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Ovqat yetkazib berishni tanlang</p>
        <div style="display: flex">
          <n-select
            v-model:value="create_food_group.food_distrubute_group_id"
            :options="fdistrubuteItems"
            placeholder="Tanlang"
            style="font-weight: 400"
            filterable
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <n-button @click="showChooseFoodDisturbute = true">...</n-button>
        </div>
        <small>
          <n-gradient-text
            type="error"
            v-if="vFoodGroup$.food_distrubute_group_id.$error"
          >
            {{ vFoodGroup$.food_distrubute_group_id.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <n-form-item label="Menyuga chiqarish" style="font-weight: bold">
        <n-switch
          v-model:value="create_food_group.showMenu"
          checked-value="1"
          unchecked-value="0"
        />
      </n-form-item>
      <div style="display: flex; flex-direction: column; height: 100px">
        <p style="font-weight: bold">Printerni tanlang</p>
        <div style="display: flex">
          <n-select
            v-model:value="create_food_group.printer_id"
            :options="printerItems"
            placeholder="Tanlang"
            style="font-weight: 400"
            filterable
          >
            <template #empty>Ma'lumotlar topilmadi 🙁</template>
          </n-select>
          <n-button @click="showChoosePrinter = true">...</n-button>
        </div>
        <small>
          <n-gradient-text type="error" v-if="vFoodGroup$.printer_id.$error">
            {{ vFoodGroup$.printer_id.$errors[0].$message }}
          </n-gradient-text>
        </small>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <n-button type="primary" @click="createFoodGroup">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <!--Add food group end-->
  <!--choose food group start-->
  <n-modal v-model:show="showChooseFoodGroup">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddFoodGroup">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchFoodGroup"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal"
        :data="loadFoodgroups"
        ref="foodGroupRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsFoodGroups"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--choose food group end-->
  <!--measure start-->
  <n-modal
    v-model:show="showAddMeasure"
    preset="dialog"
    title="Birlik qo'shish"
    :on-after-leave="leaveMeasureAdd"
  >
    <form-data-modal
      :data="formMeasure"
      @click="createMeasure"
    ></form-data-modal>
  </n-modal>
  <n-modal v-model:show="showChooseMeasure">
    <n-card
      title="Tanlang"
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="width: 400px"
    >
      <div style="display: flex">
        <n-button type="primary" @click="openAddMeasure">+</n-button>
        <n-input
          style="margin-left: 20px"
          placeholder="Qidirish"
          @input="searchMeasure"
        ></n-input>
      </div>
      <n-data-table
        :columns="columnsModal"
        :data="loadMeasures"
        ref="measureRef"
        style="margin-top: 20px"
        :max-height="300"
        :min-height="300"
        :render-cell="renderCell"
        :rowProps="rowPropsMeasure"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </n-card>
  </n-modal>
  <!--measure end-->
  <n-modal
    v-model:show="showCreate"
    preset="dialog"
    title="Taom qo'shish oynasi"
    style="width: 1000px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Nomi</p>
          <n-input
            v-model:value="create_data.name"
            placeholder="Kiriting ..."
            ref="firstInput"
          ></n-input>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.name.$error">
              {{ vCreateData$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Rasm yuklash</p>
          <n-upload :max="1" @change="handleCreateFile">
            <n-button>Rasm yuklash</n-button>
          </n-upload>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">O'lchov birligini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.measure_id"
              :options="measures"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="openChooseMeasure">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.measure_id.$error">
              {{ vCreateData$.measure_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 40px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Narxi</p>
          <n-input-number
            v-model:value="create_data.selling_price"
            placeholder="Kiriting ..."
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :format="format"
            :parse="parse"
          ></n-input-number>
          <small>
            <n-gradient-text
              type="error"
              v-if="vCreateData$.selling_price.$error"
            >
              {{ vCreateData$.selling_price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Taom guruhini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.food_group_id"
              :options="foodGroups"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showChooseFoodGroup = true">...</n-button>
          </div>
          <small>
            <n-gradient-text
              type="error"
              v-if="vCreateData$.food_group_id.$error"
            >
              {{ vCreateData$.food_group_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 70px;
          "
        >
          <p style="font-weight: bold">Rangni tanlang</p>
          <n-color-picker
            v-model:value="create_data.color"
            style="min-height: 33px"
          />
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.color.$error">
              {{ vCreateData$.color.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 70px;
          "
        >
          <p style="font-weight: bold">Oshpazni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="create_data.user_id"
              :options="chiefsSelect"
              placeholder="Tanlang"
              filterable
            >
              <template #empty> Ma'lumotlar topilmadi 🙁 </template>
            </n-select>
            <n-button @click="showChooseChief = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vCreateData$.user_id.$error">
              {{ vCreateData$.user_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Qidirish kodi</p>
          <n-input
            v-model:value="create_data.search_code"
            placeholder="Kiriting ..."
          ></n-input>
          <small>
            <n-gradient-text
              type="error"
              v-if="vCreateData$.search_code.$error"
            >
              {{ vCreateData$.search_code.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Oshpaz xaqi</p>
          <n-input-number
            v-model:value="create_data.chief_percent"
            placeholder="Kiriting ..."
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :format="format"
            :parse="parse"
          ></n-input-number>
          <small>
            <n-gradient-text
              type="error"
              v-if="vCreateData$.chief_percent.$error"
            >
              {{ vCreateData$.chief_percent.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Menyuda ko'rsatish</p>
          <n-switch
            v-model:value="create_data.showMenu"
            checked-value="1"
            unchecked-value="0"
          />
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Ommabop taomlar</p>
          <n-switch
            v-model:value="create_data.popularMenu"
            checked-value="1"
            unchecked-value="0"
          />
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Menyudan faolligni o'chirish</p>
          <n-switch
            v-model:value="create_data.disableMenu"
            checked-value="1"
            unchecked-value="0"
          />
        </div>
      </div>
      <n-button
        @click="add"
        type="primary"
        style="margin-top: 20px; margin-bottom: 20px"
        >+</n-button
      >
      <n-data-table :columns="columns2" :data="createE.data">
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
      <small>
        <n-gradient-text type="error" v-if="vCreateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
      </small>
      <small>
        <n-gradient-text type="error" v-if="createE.data.length == 0">
          Kamida bitta mahsulot biriktiring
        </n-gradient-text>
      </small>
      <n-form-item label="Umumiy summa" style="font-weight: bold">
        <p style="font-weight: 400">
          {{
            new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(create_data.total_sum)
          }}
        </p>
      </n-form-item>
      <div style="display: flex; justify-content: flex-end">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="createTaom">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <n-modal
    v-model:show="showUpdate"
    preset="dialog"
    title="Taomni o'zgartirish oynasi"
    style="width: 1000px"
    :close-on-esc="false"
    :on-after-leave="leave"
  >
    <n-form>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 100px;
        "
      >
        <div
          style="width: 20%; padding-top: 10px; height: 95px"
          v-if="update_data.default !== null"
        >
          <n-image
            width="120"
            height="100"
            :src="
              'http://localhost/bdmkafe/images/' + update_data.default_picture
            "
          />
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Nomi</p>
          <n-input
            v-model:value="update_data.name"
            placeholder="Kiriting ..."
            ref="firstUpdateInput"
          ></n-input>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.name.$error">
              {{ vUpdateData$.name.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 15%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Rasm yuklash</p>
          <n-upload :max="1" @change="handleUpdateFile">
            <n-button>Rasm yuklash</n-button>
          </n-upload>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">O'lchov birligini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.measure_id"
              :options="measures"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChooseMeasure = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.measure_id.$error">
              {{ vUpdateData$.measure_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 40px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Narxi</p>
          <n-input-number
            v-model:value="update_data.selling_price"
            placeholder="Kiriting ..."
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :format="format"
            :parse="parse"
          ></n-input-number>
          <small>
            <n-gradient-text
              type="error"
              v-if="vUpdateData$.selling_price.$error"
            >
              {{ vUpdateData$.selling_price.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Taom guruhini tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.food_group_id"
              :options="foodGroups"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChooseFoodGroup = true">...</n-button>
          </div>
          <small>
            <n-gradient-text
              type="error"
              v-if="vUpdateData$.food_group_id.$error"
            >
              {{ vUpdateData$.food_group_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 70px;
          "
        >
          <p style="font-weight: bold">Rangni tanlang</p>
          <n-color-picker
            v-model:value="update_data.color"
            style="min-height: 33px"
          />
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.color.$error">
              {{ vUpdateData$.color.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 70px;
          "
        >
          <p style="font-weight: bold">Oshpazni tanlang</p>
          <div style="display: flex">
            <n-select
              v-model:value="update_data.user_id"
              :options="chiefsSelect"
              filterable
              placeholder="Tanlang"
            >
              <template #empty> Ma'lumotlar topilmadi 🙁</template>
            </n-select>
            <n-button @click="showChooseChief = true">...</n-button>
          </div>
          <small>
            <n-gradient-text type="error" v-if="vUpdateData$.user_id.$error">
              {{ vUpdateData$.user_id.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Qidirish kodi</p>
          <n-input
            v-model:value="update_data.search_code"
            placeholder="Kiriting ..."
          ></n-input>
          <small>
            <n-gradient-text
              type="error"
              v-if="vUpdateData$.search_code.$error"
            >
              {{ vUpdateData$.search_code.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            height: 60px;
          "
        >
          <p style="font-weight: bold">Oshpaz xaqi</p>
          <n-input-number
            v-model:value="update_data.chief_percent"
            placeholder="Kiriting ..."
            type="number"
            :keyboard="{ ArrowUp: false, ArrowDown: false }"
            :show-button="false"
            :format="format"
            :parse="parse"
          ></n-input-number>
          <small>
            <n-gradient-text
              type="error"
              v-if="vUpdateData$.chief_percent.$error"
            >
              {{ vUpdateData$.chief_percent.$errors[0].$message }}
            </n-gradient-text>
          </small>
        </div>
      </div>
      <div
        style="display: flex; justify-content: space-between; margin-top: 20px"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Menyuda ko'rsatish</p>
          <n-switch v-model:value="update_data.showMenu" />
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 25%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Ommabop taomlar</p>
          <n-switch v-model:value="update_data.popularMenu" />
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 35%;
            align-items: flex-start;
          "
        >
          <p style="font-weight: bold">Menyudan faolligni o'chirish</p>
          <n-switch v-model:value="update_data.disableMenu" />
        </div>
      </div>
      <n-button
        @click="addUpdate"
        type="primary"
        style="margin-top: 20px; margin-bottom: 20px"
        >+</n-button
      >
      <n-data-table :columns="columnsUpdate" :data="updateE.data">
        <template #empty><table-no-data></table-no-data></template>
      </n-data-table>
      <small>
        <n-gradient-text type="error" v-if="vUpdateExtra$.$error">
          Yuqoridagi ma'lumotlarni to'ldiring
        </n-gradient-text>
      </small>
      <small>
        <n-gradient-text type="error" v-if="updateE.data.length == 0">
          Kamida bitta mahsulot biriktiring
        </n-gradient-text>
      </small>
      <n-form-item label="Umumiy summa" style="font-weight: bold">
        <p style="font-weight: 400">
          {{
            new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(update_data.total_sum)
          }}
        </p>
      </n-form-item>
      <div style="display: flex; justify-content: flex-end">
        <n-button
          @click="cancelCallback"
          style="margin-right: 10px"
          type="error"
          >Close</n-button
        >
        <n-button type="primary" @click="updateTaom">Submit</n-button>
      </div>
    </n-form>
  </n-modal>
  <div style="display: flex; justify-content: space-between">
    <n-button type="primary" @click="showCreate = true">+</n-button>
    <n-input
      type="text"
      placeholder="Search"
      style="width: 94%; border-radius: 5px"
      @input="filter"
    />
  </div>
  <br />
  <div style="display: flex; justify-content: space-between">
    <div style="width: 69%">
      <n-data-table
        ref="foodRef"
        :data="data"
        :columns="columns"
        :pagination="paginition"
        :rowProps="rowProps"
        :render-cell="renderCell"
      >
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </div>
    <div style="width: 30%">
      <n-data-table :data="childs.data" :columns="childColumns">
        <template #empty>
          <table-no-data></table-no-data>
        </template>
      </n-data-table>
    </div>
  </div>
</template>
<script>
import FoodService from '../../../services/food.service'
import FoodgroupService from '../../../services/food-group.service'
import FoodDistService from '../../../services/food-disturbute.service'
import FoodresourceService from '../../../services/food_resourse.service'
import PrinterService from '../../../services/printer.service'
import ChiefService from '../../../services/chief.service'
import MeasureService from '../../../services/measure.service'
import TableNoData from '../../../components/TableNoData.vue'
import { ref, onMounted, h, computed, watchEffect } from 'vue'
import {
  NButton,
  NIcon,
  NSelect,
  useDialog,
  useMessage,
  NTag,
  NText,
  NInputNumber,
} from 'naive-ui'
import Pencil from '@vicons/tabler/Pencil'
import Delete from '@vicons/fluent/Delete20Regular'
import Click from '@vicons/fluent/CursorClick20Regular'
import Cancel from '@vicons/material/CancelFilled'
import useValidate from '@vuelidate/core'
import {
  required,
  helpers,
  maxLength,
  minLength,
  email,
  numeric,
} from '@vuelidate/validators'
import FormDataModal from '../../components/FormData.vue'
import { useStore } from 'vuex'
const modalColumn = () => {
  return [
    {
      title: '#',
      key: 'no',
      width: 50,
      render: (_, index) => {
        return index + 1
      },
    },
    {
      title: 'Name',
      key: 'name',
      filter(value, row) {
        return ~row.name.toLowerCase().indexOf(value.toLowerCase())
      },
    },
  ]
}
const modalColumn2 = () => {
  return [
    {
      title: '#',
      key: 'no',
      width: 50,
      render: (_, index) => {
        return index + 1
      },
    },
    {
      title: 'Name',
      key: 'username',
      filter(value, row) {
        return ~row.username.toLowerCase().indexOf(value.toLowerCase())
      },
    },
  ]
}
const createColumns = ({ update, del, click }) => {
  return [
    {
      title: '#',
      key: 'no',
      width: 50,
      render: (_, index) => {
        return index + 1
      },
    },
    {
      title: 'Nomi',
      key: 'name',
      sorter: (row1, row2) => row1.name.localeCompare(row2.name),
      filter(value, row) {
        return (
          ~row.measure.name.toLowerCase().indexOf(value.toLowerCase()) ||
          ~row.selling_price.toString().indexOf(value) ||
          ~row.name.toLowerCase().indexOf(value.toLowerCase())
        )
      },
    },
    {
      title: 'Narxi',
      key: 'selling_price',
      sorter: (row1, row2) => row1.selling_price - row2.selling_price,
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.selling_price,
        )
      },
    },
    {
      title: "O'lchov birligi",
      key: 'measure.name',
      sorter: (row1, row2) =>
        row1.measure.name.localeCompare(row2.measure.name),
    },
    {
      title: 'Action',
      key: 'actions',
      render(row, index) {
        return [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                fontSize: '20px',
              },
              onClick: (e) => click(row, index, e),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Click,
                }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              style: {
                height: '35px',
                marginLeft: '10px',
              },
              onClick: (e) => update(row, e),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Pencil,
                }),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                height: '35px',
                marginLeft: '10px',
              },
              onClick: (e) => del(row, index, e),
            },
            {
              icon: () =>
                h(NIcon, {
                  component: Delete,
                }),
            },
          ),
        ]
      },
    },
  ]
}
const createChildcolumns = () => {
  return [
    {
      title: 'Mahsulot',
      key: 'food_resource.name',
    },
    {
      title: 'Miqdori',
      key: 'amount',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.amount,
        )
      },
    },
    {
      title: 'Narxi',
      key: 'food_resource.purchase_price',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.food_resource.purchase_price,
        )
      },
    },
    {
      title: 'Summa',
      key: 'sum',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(
          _.sum,
        )
      },
    },
  ]
}
export default {
  components: {
    TableNoData,
    FormDataModal,
  },
  setup() {
    const parse = (input) => {
      const nums = input.replace(/\s/g, '').trim()
      if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
      return nums === '' ? null : Number.NaN
    }
    const format = (value) => {
      if (value === null) return ''
      return value.toLocaleString('ru-RU')
    }
    let data = ref([])
    const firstInput = ref(null)
    const firstUpdateInput = ref(null)
    let create_data = ref({
      name: '',
      picture: '',
      measure_id: null,
      selling_price: 0,
      food_group_id: null,
      color: '',
      user_id: null,
      showMenu: 0,
      popularMenu: 0,
      disableMenu: 0,
      search_code: '',
      chief_percent: 0,
      total_sum: 0,
    })
    let update_data = ref({
      name: '',
      default_picture: '',
      picture: '',
      measure_id: null,
      selling_price: 0,
      food_group_id: null,
      color: '',
      user_id: '',
      showMenu: 0,
      popularMenu: 0,
      disableMenu: 0,
      search_code: '',
      chief_percent: 0,
      total_sum: 0,
    })

    let updateId = ref(null)
    const createE = ref({
      data: [],
    })
    const updateE = ref({
      data: [],
    })
    let loadMeasures = ref([])
    let measures = ref([])
    let foodGroups = ref([])
    let loadFoodgroups = ref([])
    let foodResources = ref([])
    let foodResourcesSelect = ref([])
    let childs = ref({
      id: null,
      data: [],
    })
    let showCreate = ref(false)
    let showUpdate = ref(false)
    const store = useStore()
    const message = useMessage()
    const dialog = useDialog()
    const openCreate = function () {
      showCreate.value = true
    }
    const foodInst = ref(null)
    onMounted(async () => {
      data.value = await FoodService.getAll()
      loadMeasures.value = await MeasureService.getAll()
      for (let index = 0; index < loadMeasures.value.length; index++) {
        const element = loadMeasures.value[index]
        measures.value.push({ label: element.name, value: element.id })
      }
      loadFoodgroups.value = await FoodgroupService.getAll()
      for (let index = 0; index < loadFoodgroups.value.length; index++) {
        const element = loadFoodgroups.value[index]
        foodGroups.value.push({ label: element.name, value: element.id })
      }
      foodResources.value = await FoodresourceService.getAll()
      for (let index = 0; index < foodResources.value.length; index++) {
        const element = foodResources.value[index]
        foodResourcesSelect.value.push({
          label: element.name,
          value: element.id,
        })
      }
    })
    const handleCreateFile = (event) => {
      create_data.value.picture = event.file.file
    }
    const handleUpdateFile = (event) => {
      update_data.value.picture = event.file.file
    }
    const add = function () {
      createE.value.data.push({
        food_resource_id: null,
        measure_id: null,
        amount: 0,
        measure: '',
        price: '',
        sum: '',
        calc_sum: 0,
      })
    }
    const addUpdate = function () {
      updateE.value.data.push({
        food_resource_id: null,
        measure_id: null,
        amount: 0,
        measure: '',
        price: '',
        sum: '',
        calc_sum: 0,
      })
    }
    const createColumnsE = ({ del }) => [
      {
        title: 'Mahsulot',
        key: 'food_resource_id',
        className: 'foodR',
        render(row, index) {
          return [
            h(
              NSelect,
              {
                value: row.food_resource_id,
                options: foodResourcesSelect.value,
                placeholder: 'Tanlang',
                filterable: true,
                style: {
                  width: '200px',
                  marginBottom: '12px',
                },
                onUpdateValue(v) {
                  createE.value.data[index].food_resource_id = v
                  const food = foodResources.value.find((val) => val.id == v)
                  createE.value.data[index].price = food.purchase_price
                  createE.value.data[index].measure = food.measure.name
                  createE.value.data[index].measure_id = food.measure.id
                  if (createE.value.data[index].amount != '') {
                    createE.value.data[index].sum =
                      Number(createE.value.data[index].price) *
                      Number(createE.value.data[index].amount)
                    create_data.value.total_sum = 0
                    for (
                      let index = 0;
                      index < createE.value.data.length;
                      index++
                    ) {
                      const element = createE.value.data[index]
                      if (element.sum != '') {
                        create_data.value.total_sum += Number(element.sum)
                        element.sum = element.sum.toString()
                      }
                    }
                  }
                  createE.value.data[index].price =
                    createE.value.data[index].price.toString()
                },
              },
              {
                empty: () => "Ma'lumotlar topilmadi 🙁",
              },
            ),
            h(NButton, {
              style: {
                width: '20px',
                border: '1px solid #eee',
              },
              innerHTML: '...',
              onClick: () => {
                showChooseProduct.value = true
                indexOfProduct.value = index
              },
            }),
          ]
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInputNumber, {
            value: row.amount,
            placeholder: 'Kiriting',
            type: 'number',
            format: format,
            parse: parse,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            'show-button': false,
            onUpdateValue(v) {
              createE.value.data[index].amount = v
              if (v == '') {
                createE.value.data[index].sum = '0'
              } else {
                createE.value.data[index].sum =
                  Number(v) * Number(createE.value.data[index].price)
              }
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: "O'lchov birligi",
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'price',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.price),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.sum),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Taxminiy summa',
        key: 'calc_sum',
        render(row, index) {
          return h(NInputNumber, {
            value: row.calc_sum,
            placeholder: 'Kiriting',
            format: format,
            parse: parse,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            'show-button': false,
            onUpdateValue(v) {
              createE.value.data[index].calc_sum = v
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const updateColumnsE = ({ del }) => [
      {
        title: 'Mahsulot',
        key: 'food_resource_id',
        className: 'foodR',
        render(row, index) {
          return [
            h(
              NSelect,
              {
                value: row.food_resource_id,
                options: foodResourcesSelect.value,
                placeholder: 'Tanlang',
                filterable: true,
                style: {
                  width: '200px',
                  marginBottom: '12px',
                },
                onUpdateValue(v) {
                  updateE.value.data[index].food_resource_id = v
                  const food = foodResources.value.find((val) => val.id == v)
                  updateE.value.data[index].price = food.purchase_price
                  updateE.value.data[index].measure = food.measure.name
                  updateE.value.data[index].measure_id = food.measure.id
                  if (updateE.value.data[index].amount != '') {
                    updateE.value.data[index].sum =
                      Number(updateE.value.data[index].price) *
                      Number(updateE.value.data[index].amount)
                    update_data.value.total_sum = 0
                    for (
                      let index = 0;
                      index < updateE.value.data.length;
                      index++
                    ) {
                      const element = updateE.value.data[index]
                      if (element.sum != '') {
                        update_data.value.total_sum += Number(element.sum)
                        element.sum = element.sum.toString()
                      }
                    }
                  }
                  updateE.value.data[index].price =
                    updateE.value.data[index].price.toString()
                },
              },
              {
                empty: () => "Ma'lumotlar topilmadi 🙁",
              },
            ),
            h(NButton, {
              style: {
                width: '20px',
                border: '1px solid #eee',
              },
              innerHTML: '...',
              onClick: () => {
                showChooseProduct.value = true
                indexOfProduct.value = index
              },
            }),
          ]
        },
      },
      {
        title: 'Miqdori',
        key: 'amount',
        render(row, index) {
          return h(NInputNumber, {
            value: row.amount,
            placeholder: 'Kiriting',
            type: 'number',
            format: format,
            parse: parse,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            'show-button': false,
            onUpdateValue(v) {
              updateE.value.data[index].amount = v
              if (updateE.value.data[index].amount == '') {
                updateE.value.data[index].sum = '0'
              } else {
                updateE.value.data[index].sum =
                  Number(v) * Number(updateE.value.data[index].price)
              }
              update_data.value.total_sum = 0
              for (let index = 0; index < updateE.value.data.length; index++) {
                const element = updateE.value.data[index]
                if (element.sum != '') {
                  update_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            },
          })
        },
      },
      {
        title: "O'lchov birligi",
        key: 'measure',
        render(row) {
          return h(NTag, {
            innerHTML: row.measure,
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Narxi',
        key: 'price',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.price),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Summa',
        key: 'sum',
        render(row) {
          return h(NTag, {
            innerHTML: new Intl.NumberFormat('ru-RU', {
              style: 'decimal',
            }).format(row.sum),
            style: {
              backgroundColor: '#fafafc',
              width: '120px',
              height: '35px',
              border: '1px solid #eee',
              borderRadius: '4px',
              marginTop: '3px',
            },
          })
        },
      },
      {
        title: 'Taximiniy summa',
        key: 'calc_sum',
        render(row, index) {
          return h(NInputNumber, {
            value: row.calc_sum,
            format: format,
            parse: parse,
            keyboard: {
              ArrowUp: false,
              ArrowDown: false,
            },
            'show-button': false,
            placeholder: 'Kiriting',
            onUpdateValue(v) {
              updateE.value.data[index].calc_sum = v
            },
          })
        },
      },
      {
        title: 'Actions',
        test: 'actions',
        render(row, index) {
          return [
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                style: {
                  height: '35px',
                  marginLeft: '10px',
                },
                onClick: () => del(row, index),
              },
              {
                icon: () =>
                  h(NIcon, {
                    component: Cancel,
                  }),
              },
            ),
          ]
        },
      },
    ]
    const rulesData = computed(() => {
      return {
        name: {
          required: helpers.withMessage('Nomini kiriting', required),
          maxLength: helpers.withMessage(
            "Maximal 55 ta belgi bo'lishi kerak",
            maxLength(55),
          ),
        },
        measure_id: {
          required: helpers.withMessage("O'lchov birligini tanlang", required),
        },
        food_group_id: {
          required: helpers.withMessage('Taomlar guruhini tanlang', required),
        },
        user_id: {
          required: helpers.withMessage('Oshpazni tanlang', required),
        },
        selling_price: {
          required: helpers.withMessage('Taom narxini kiriting', required),
        },
        chief_percent: {
          required: helpers.withMessage('Oshpaz foizini kiriting', required),
        },
        color: {
          required: helpers.withMessage('Rangni tanlang', required),
        },
        search_code: {
          required: helpers.withMessage('Qidirish kodini kiriting', required),
        },
      }
    })
    const rulesExtraData = computed(() => {
      return {
        data: {
          $each: helpers.forEach({
            food_resource_id: {
              required: helpers.withMessage('Mahsulotni tanlang', required),
            },
            amount: {
              required: helpers.withMessage("Miqdorni to'ldiring", required),
            },
          }),
        },
      }
    })
    const vCreateData$ = useValidate(rulesData, create_data)
    const vCreateExtra$ = useValidate(rulesExtraData, createE)
    const vUpdateData$ = useValidate(rulesData, update_data)
    const vUpdateExtra$ = useValidate(rulesExtraData, updateE)
    const createTaom = function () {
      vCreateData$.value.$validate()
      vCreateExtra$.value.$validate()
      if (
        !vCreateData$.value.$error &&
        !vCreateExtra$.value.$error &&
        createE.value.data.length !== 0
      ) {
        const formData = new FormData()
        formData.append('name', create_data.value.name)
        formData.append('picture', create_data.value.picture)
        formData.append('measure_id', create_data.value.measure_id)
        formData.append('selling_price', create_data.value.selling_price)
        formData.append('food_group_id', create_data.value.food_group_id)
        formData.append('color', create_data.value.color)
        formData.append('user_id', create_data.value.user_id)
        formData.append('showMenu', create_data.value.showMenu)
        formData.append('popularMenu', create_data.value.popularMenu)
        formData.append('disableMenu', create_data.value.disableMenu)
        formData.append('search_code', create_data.value.search_code)
        formData.append('chief_percent', create_data.value.chief_percent)
        for (let index = 0; index < createE.value.data.length; index++) {
          const element = createE.value.data[index]
          delete element['measure']
          delete element['price']
        }
        // formData.append('food_tables', createE.value.data)
        for (let index = 0; index < createE.value.data.length; index++) {
          const element = createE.value.data[index]
          formData.append(
            `food_tables[${index}][food_resource_id]`,
            element.food_resource_id,
          )
          formData.append(
            `food_tables[${index}][measure_id]`,
            element.measure_id,
          )
          formData.append(`food_tables[${index}][amount]`, element.amount)
          formData.append(`food_tables[${index}][sum]`, element.sum)
          formData.append(`food_tables[${index}][calc_sum]`, element.calc_sum)
        }
        FoodService.create(formData).then((res) => {
          data.value.push(res)
          showCreate.value = false
          leave()
        })
      }
    }
    const updateTaom = function () {
      vUpdateData$.value.$validate()
      vUpdateExtra$.value.$validate()
      if (
        !vUpdateData$.value.$error &&
        !vUpdateExtra$.value.$error &&
        updateE.value.data.length !== 0
      ) {
        const formData = new FormData()
        formData.append('name', update_data.value.name)
        formData.append('picture', update_data.value.picture)
        formData.append('measure_id', update_data.value.measure_id)
        formData.append('selling_price', update_data.value.selling_price)
        formData.append('food_group_id', update_data.value.food_group_id)
        formData.append('color', update_data.value.color)
        formData.append('user_id', update_data.value.user_id)
        update_data.value.showMenu == true
          ? formData.append('showMenu', 1)
          : formData.append('showMenu', 0)
        update_data.value.popularMenu == true
          ? formData.append('popularMenu', 1)
          : formData.append('popularMenu', 0)
        update_data.value.disableMenu == true
          ? formData.append('disableMenu', 1)
          : formData.append('disableMenu', 0)
        formData.append('search_code', update_data.value.search_code)
        formData.append('chief_percent', update_data.value.chief_percent)
        for (let index = 0; index < updateE.value.data.length; index++) {
          const element = updateE.value.data[index]
          delete element['measure']
          delete element['price']
        }
        for (let index = 0; index < updateE.value.data.length; index++) {
          const element = updateE.value.data[index]
          formData.append(
            `food_tables[${index}][food_resource_id]`,
            element.food_resource_id,
          )
          formData.append(
            `food_tables[${index}][measure_id]`,
            element.measure_id,
          )
          formData.append(`food_tables[${index}][amount]`, element.amount)
          formData.append(`food_tables[${index}][sum]`, element.sum)
          formData.append(`food_tables[${index}][calc_sum]`, element.calc_sum)
        }
        FoodService.update(updateId.value, formData).then((res) => {
          const index = data.value.findIndex((val) => val.id == res.id)
          data.value[index] = res
          leave()
          showUpdate.value = false
        })
      }
    }
    const del = function (row) {
      // cancelCallback()
      dialog.success({
        title: 'Ogohlantirish',
        content: "O'chirilsinmi ?",
        positiveText: 'Ha',
        negativeText: "Yo'q",
        onPositiveClick: () => {
          FoodService.delete(row.id).then((res) => {
            message.success("Muvaffaqiyatli o'chirildi")
            const index = data.value.findIndex((val) => val.id == res.id)
            data.value.splice(index, 1)
            if (row.id == childs.value.id) {
              childs.value.data = []
              childs.value.id = null
            }
          })
        },
        onNegativeClick: () => {
          message.info("O'chirilmadi")
        },
      })
    }
    const cancelCallback = function () {
      showCreate.value = false
      showUpdate.value = false
      leave()
    }
    const leave = function () {
      updateE.value.data = []
      createE.value.data = []
      updateId.value = null
      create_data.value = {
        name: '',
        picture: '',
        measure_id: null,
        selling_price: '',
        food_group_id: null,
        color: '',
        user_id: '',
        showMenu: 0,
        popularMenu: 0,
        disableMenu: 0,
        search_code: '',
        chief_percent: '',
        total_sum: 0,
      }
      update_data.value = {
        name: '',
        default_picture: '',
        picture: '',
        measure_id: null,
        selling_price: '',
        food_group_id: null,
        color: '',
        user_id: '',
        showMenu: 0,
        popularMenu: 0,
        disableMenu: 0,
        search_code: '',
        chief_percent: '',
        total_sum: 0,
      }
      vCreateData$.value.$reset()
      vCreateExtra$.value.$reset()
      vUpdateExtra$.value.$reset()
      vUpdateData$.value.$reset()
    }
    const rowProps = (row, index) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          childs.value.id = row.id
          childs.value.data = data.value[index].food_tables
        },
      }
    }
    const filter = (e) => {
      foodInst.value.filter({
        name: [e],
      })
    }
    watchEffect(() => {
      if (firstInput.value) {
        firstInput.value.focus()
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
      if (firstUpdateInput.value) {
        firstUpdateInput.value.focus()
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
    })
    //measure start
    const showChooseMeasure = ref(false)
    const showAddMeasure = ref(false)
    const measureInst = ref(null)
    const openChooseMeasure = () => {
      showChooseMeasure.value = true
    }
    const openAddMeasure = () => {
      showChooseMeasure.value = false
      showAddMeasure.value = true
    }
    const rowPropsMeasure = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            if (indexOfProduct.value != null) {
              create_product.value.measure_id = row.id
            } else {
              create_data.value.measure_id = row.id
            }
          } else if (showUpdate.value) {
            if (indexOfProduct.value != null) {
              create_product.value.measure_id = row.id
            } else {
              update_data.value.measure_id = row.id
            }
          }
          showChooseMeasure.value = false
        },
      }
    }
    const searchMeasure = (e) => {
      measureInst.value.filter({
        name: [e],
      })
    }
    const formMeasure = [
      { value: '', key: 'name', label: 'Name', type: 'input' },
    ]
    const leaveMeasureAdd = () => {
      store.dispatch('setNull')
    }
    const rulesMeasure = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 20 ta belgidan oshmasligi kerak',
            maxLength(20),
          ),
        },
      }
    })
    const createMeasure = async (e) => {
      const vMeasure$ = useValidate(rulesMeasure, e)
      vMeasure$.value.$validate()
      store.state.modalValidations = vMeasure$
      if (!vMeasure$.value.$error) {
        const data = await MeasureService.create(e)
        loadMeasures.value.push(data)
        measures.value.push({ label: data.name, value: data.id })
        if (showCreate.value) {
          if (indexOfProduct.value != null) {
            create_product.value.measure_id = data.id
          } else {
            create_data.value.measure_id = data.id
          }
        } else if (showUpdate.value) {
          if (indexOfProduct.value != null) {
            create_product.value.measure_id = data.id
          } else {
            update_data.value.measure_id = data.id
          }
        }
        showAddMeasure.value = false
      }
    }
    //measure end
    //foodgroup start
    const showChooseFoodGroup = ref(false)
    const showAddFoodGroup = ref(false)
    const foodGroupInst = ref(null)
    const loadFdistrubute = ref([])
    const fdistrubuteItems = ref([])
    onMounted(async () => {
      loadFdistrubute.value = await FoodDistService.getAll()
      for (let index = 0; index < loadFdistrubute.value.length; index++) {
        const element = loadFdistrubute.value[index]
        fdistrubuteItems.value.push({ label: element.name, value: element.id })
      }
    })
    const searchFoodGroup = (e) => {
      foodGroupInst.value.filter({
        name: [e],
      })
    }
    const openAddFoodGroup = () => {
      showChooseFoodGroup.value = false
      showAddFoodGroup.value = true
    }
    const rowPropsFoodGroups = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChooseFoodGroup.value = false
          if (showCreate.value) {
            create_data.value.food_group_id = row.id
          } else {
            update_data.value.food_group_id = row.id
          }
        },
      }
    }
    const create_food_group = ref({
      name: '',
      showMenu: 0,
      food_distrubute_group_id: null,
      printer_id: null,
    })
    const rulesFoodGroup = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        food_distrubute_group_id: {
          required: helpers.withMessage(
            'Ovqat yetkazib berish tanlanishi kerak',
            required,
          ),
        },
        printer_id: {
          required: helpers.withMessage('Printer tanlanishi kerak', required),
        },
      }
    })
    const vFoodGroup$ = useValidate(rulesFoodGroup, create_food_group)
    const createFoodGroup = async () => {
      vFoodGroup$.value.$validate()
      if (!vFoodGroup$.value.$error) {
        try {
          const res = await FoodgroupService.create(create_food_group.value)
          loadFoodgroups.value.push(res)
          foodGroups.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            create_data.value.food_group_id = res.id
          } else if (showUpdate.value) {
            update_data.value.food_group_id = res.id
          }
        } catch (error) {
          message.error(error)
        }
        showAddFoodGroup.value = false
      }
    }
    const leaveFoodGroupAdd = () => {
      create_food_group.value = {
        name: '',
        showMenu: 0,
        food_distrubute_group_id: null,
        printer_id: null,
      }
      vFoodGroup$.value.$reset()
    }
    //foodgroup end
    //printer start
    const showChoosePrinter = ref(false)
    const showAddPrinter = ref(false)
    const loadPrinters = ref([])
    const printerItems = ref([])
    const printerInst = ref(null)
    const leavePrinter = () => {
      create_printer.value = {
        name: '',
        ip: '',
      }
      vPrinter$.value.$reset()
    }
    const searchPrinter = (e) => {
      printerInst.value.filter({
        name: [e],
      })
    }
    const rowPropsPrinter = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChoosePrinter.value = false
          create_food_group.value.printer_id = row.id
        },
      }
    }
    const openAddPrinter = () => {
      showChoosePrinter.value = false
      showAddPrinter.value = true
    }
    onMounted(async () => {
      loadPrinters.value = await PrinterService.getAll()
      for (let index = 0; index < loadPrinters.value.length; index++) {
        const element = loadPrinters.value[index]
        printerItems.value.push({ label: element.name, value: element.id })
      }
    })
    const rulesPrinter = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
        ip: {
          required: helpers.withMessage("IP bo'sh bo'lmasligi kerak", required),
          maxLength: helpers.withMessage(
            'IP 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
      }
    })
    const create_printer = ref({
      name: '',
      ip: '',
    })
    const vPrinter$ = useValidate(rulesPrinter, create_printer)
    const createPrinter = async () => {
      vPrinter$.value.$validate()
      if (!vPrinter$.value.$error) {
        try {
          const res = await PrinterService.create(create_printer.value)
          loadPrinters.value.push(res)
          printerItems.value.push({ label: res.name, value: res.id })
          create_food_group.value.printer_id = res.id
          showAddPrinter.value = false
        } catch (e) {
          message.error(e)
        }
      }
    }
    //printer end
    //food disturbute start
    const showChooseFoodDisturbute = ref(false)
    const showAddFoodDisturbute = ref(false)
    const foodDisturbuteInst = ref(null)
    const openAddFoodDisturbute = () => {
      showChooseFoodDisturbute.value = false
      showAddFoodDisturbute.value = true
    }
    const searchFoodDisturbute = (e) => {
      foodDisturbuteInst.value.filter({
        name: [e],
      })
    }
    const create_food_disturbute = ref({
      name: '',
      showMenu: 0,
    })
    const rowPropsFoodDisturbute = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChooseFoodDisturbute.value = false
          create_food_group.value.food_distrubute_group_id = row.id
        },
      }
    }
    const rulesFoodDisturbute = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 55 ta belgidan oshmasligi kerak',
            maxLength(55),
          ),
        },
      }
    })
    const vFoodDisturbute$ = useValidate(
      rulesFoodDisturbute,
      create_food_disturbute,
    )
    const leaveFoodDisturbuteAdd = () => {
      vFoodDisturbute$.value.$reset()
      create_food_disturbute.value = {
        name: '',
        showMenu: 0,
      }
    }
    const createFooddistrubute = async () => {
      vFoodDisturbute$.value.$validate()
      if (!vFoodDisturbute$.value.$error) {
        try {
          const res = await FoodDistService.create(create_food_disturbute.value)
          loadFdistrubute.value.push(res)
          fdistrubuteItems.value.push({ label: res.name, value: res.id })
          create_food_group.value.food_distrubute_group_id = res.id
          showAddFoodDisturbute.value = false
        } catch (error) {
          message.error(error)
        }
      }
    }
    //food disturbute end
    //chief start
    const showChooseChief = ref(false)
    const showAddChief = ref(false)
    const chiefInst = ref(null)
    const chiefs = ref([])
    const chiefsSelect = ref([])
    const create_chief = ref({
      username: '',
      password: '',
      email: '',
    })
    const rulesChief = computed(() => {
      return {
        username: {
          required: helpers.withMessage(
            "Username bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 100 ta belgidan oshmasligi kerak',
            maxLength(100),
          ),
          minLength: helpers.withMessage(
            "Name kamida 2 ta belgidan iborat bo'lishi kerak",
            minLength(2),
          ),
        },
        password: {
          required: helpers.withMessage(
            "Password bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 25 ta belgidan oshmasligi kerak',
            maxLength(25),
          ),
        },
        email: {
          required: helpers.withMessage(
            "Email bo'sh bo'lmasligi kerak",
            required,
          ),
          email: helpers.withMessage("Bu email bo'lishi kerak", email),
        },
      }
    })
    const vChief$ = useValidate(rulesChief, create_chief)
    const createChief = async () => {
      vChief$.value.$validate()
      if (!vChief$.value.$error) {
        try {
          showAddChief.value = false
          const res = await ChiefService.create(create_chief.value)
          chiefs.value.push(res)
          chiefsSelect.value.push({ label: res.username, value: res.id })
          if (showCreate.value) {
            create_data.value.user_id = res.id
          } else if (showUpdate.value) {
            update_data.value.user_id = res.id
          }
        } catch (e) {
          message.error(e)
        }
      }
    }
    const leaveChief = () => {
      create_chief.value = {
        username: '',
        password: '',
        email: '',
      }
      vChief$.value.$reset()
    }
    onMounted(async () => {
      chiefs.value = await ChiefService.getAll()
      for (let index = 0; index < chiefs.value.length; index++) {
        const element = chiefs.value[index]
        chiefsSelect.value.push({ label: element.username, value: element.id })
      }
    })
    const openAddChief = () => {
      showChooseChief.value = false
      showAddChief.value = true
    }
    const searchChief = (e) => {
      chiefInst.value.filter({
        username: [e],
      })
    }
    const rowPropsChief = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          if (showCreate.value) {
            create_data.value.user_id = row.id
          } else if (showUpdate.value) {
            update_data.value.user_id = row.id
          }
          showChooseChief.value = false
        },
      }
    }
    //chief end
    //product start
    const showChooseProduct = ref(false)
    const showAddProduct = ref(false)
    const indexOfProduct = ref(null)
    const productInst = ref(null)
    const openAddProduct = () => {
      showChooseProduct.value = false
      showAddProduct.value = true
    }
    const searchProduct = (e) => {
      productInst.value.filter({
        name: [e],
      })
    }
    const rowPropsProduct = (row) => {
      return {
        style: 'cursor: pointer',
        onClick: () => {
          showChooseProduct.value = false
          if (showCreate.value) {
            const index = indexOfProduct.value
            createE.value.data[index].food_resource_id = row.id
            const food = foodResources.value.find((val) => val.id == row.id)
            createE.value.data[index].price = food.purchase_price
            createE.value.data[index].measure = food.measure.name
            createE.value.data[index].measure_id = food.measure.id
            if (createE.value.data[index].amount != '') {
              createE.value.data[index].sum =
                Number(createE.value.data[index].price) *
                Number(createE.value.data[index].amount)
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            }
            createE.value.data[index].price =
              createE.value.data[index].price.toString()
          } else if (showUpdate.value) {
            updateE.value.data[indexOfProduct.value].food_resource_id = row.id
          }
          indexOfProduct.value = null
        },
      }
    }
    const create_product = ref({
      name: '',
      measure_id: null,
      purchase_price: '',
    })
    const rulesProduct = computed(() => {
      return {
        name: {
          required: helpers.withMessage(
            "Name bo'sh bo'lmasligi kerak",
            required,
          ),
          maxLength: helpers.withMessage(
            'Name 30 ta belgidan oshmasligi kerak',
            maxLength(30),
          ),
        },
        measure_id: {
          required: helpers.withMessage(
            "O'lchov birligi tanlanishi kerak",
            required,
          ),
        },
        purchase_price: {
          required: helpers.withMessage(
            "Sotib olish narxi bo'sh bo'lmasligi kerak",
            required,
          ),
          numeric: helpers.withMessage(
            "Sotib olish narxi son bo'lishi kerak",
            numeric,
          ),
        },
      }
    })
    const vProduct$ = useValidate(rulesProduct, create_product)
    const createProduct = async () => {
      vProduct$.value.$validate()
      if (!vProduct$.value.$error) {
        try {
          const index = indexOfProduct.value
          const res = await FoodresourceService.create(create_product.value)
          foodResources.value.push(res)
          foodResourcesSelect.value.push({ label: res.name, value: res.id })
          if (showCreate.value) {
            createE.value.data[index].food_resource_id = res.id
            const food = foodResources.value.find((val) => val.id == res.id)
            createE.value.data[index].price = food.purchase_price
            createE.value.data[index].measure = food.measure.name
            createE.value.data[index].measure_id = food.measure.id
            if (createE.value.data[index].amount != '') {
              createE.value.data[index].sum =
                Number(createE.value.data[index].price) *
                Number(createE.value.data[index].amount)
              create_data.value.total_sum = 0
              for (let index = 0; index < createE.value.data.length; index++) {
                const element = createE.value.data[index]
                if (element.sum != '') {
                  create_data.value.total_sum += Number(element.sum)
                  element.sum = element.sum.toString()
                }
              }
            }
            createE.value.data[index].price =
              createE.value.data[index].price.toString()
          } else if (showUpdate.value) {
            updateE.value.data[index].food_resource_id = res.id
          }
          showAddProduct.value = false
        } catch (e) {
          message.error(e)
        }
      }
    }
    const leaveProduct = () => {
      vProduct$.value.$reset()
      create_product.value = {
        name: '',
        measure_id: null,
        purchase_price: '',
      }
      indexOfProduct.value = null
    }
    //product end
    //measure start
    //measure end
    return {
      rowProps,
      data,
      searchProduct,
      create_product,
      productRef: productInst,
      rowPropsProduct,
      leaveProduct,
      vProduct$,
      showCreate,
      openAddProduct,
      createProduct,
      showUpdate,
      showChooseProduct,
      showAddProduct,
      showChooseChief,
      searchChief,
      rowPropsChief,
      leaveChief,
      create_chief,
      showAddChief,
      createChief,
      vChief$,
      chiefs,
      chiefsSelect,
      chiefRef: chiefInst,
      openAddChief,
      showChoosePrinter,
      showAddPrinter,
      showChooseFoodDisturbute,
      showAddFoodDisturbute,
      create_printer,
      createPrinter,
      openAddPrinter,
      rowPropsPrinter,
      searchFoodDisturbute,
      searchPrinter,
      vPrinter$,
      leavePrinter,
      printerRef: printerInst,
      foodDisturbuteRef: foodDisturbuteInst,
      leaveFoodDisturbuteAdd,
      create_food_disturbute,
      rowPropsFoodDisturbute,
      createFooddistrubute,
      openAddFoodDisturbute,
      vFoodDisturbute$,
      create_data,
      update_data,
      updateId,
      vCreateData$,
      vCreateExtra$,
      vUpdateData$,
      vUpdateExtra$,
      vFoodGroup$,
      loadPrinters,
      printerItems,
      loadFdistrubute,
      fdistrubuteItems,
      create_food_group,
      childs,
      measures,
      foodGroups,
      searchFoodGroup,
      showChooseFoodGroup,
      createFoodGroup,
      showAddFoodGroup,
      openAddFoodGroup,
      foodGroupRef: foodGroupInst,
      loadFoodgroups,
      rowPropsFoodGroups,
      handleCreateFile,
      handleUpdateFile,
      foodRef: foodInst,
      measureRef: measureInst,
      firstInput,
      firstUpdateInput,
      openCreate,
      leaveFoodGroupAdd,
      leave,
      createTaom,
      updateTaom,
      filter,
      cancelCallback,
      showAddMeasure,
      showChooseMeasure,
      openChooseMeasure,
      openAddMeasure,
      rowPropsMeasure,
      searchMeasure,
      formMeasure,
      foodResources,
      leaveMeasureAdd,
      createMeasure,
      loadMeasures,
      paginition: {
        pageSize: 6,
      },
      createE,
      updateE,
      add,
      addUpdate,
      columnsUpdate: updateColumnsE({
        del(row, index) {
          if (updateE.value.data[index].sum != '') {
            update_data.value.total_sum -= updateE.value.data[index].sum
          }
          updateE.value.data.splice(index, 1)
        },
      }),
      columns: createColumns({
        click(row, index, e) {
          e.stopPropagation()
          childs.value.id = row.id
          childs.value.data = data.value[index].food_tables
        },
        del(row, index, e) {
          e.stopPropagation()
          del(row, index)
        },
        update(row, e) {
          e.stopPropagation()
          updateId.value = row.id
          update_data.value.name = row.name
          update_data.value.default_picture = row.picture
          update_data.value.measure_id = row.measure.id
          update_data.value.selling_price = row.selling_price
          update_data.value.food_group_id = row.food_group.id
          update_data.value.color = row.color
          update_data.value.user_id = row.user_id
          row.showMenu == 1
            ? (update_data.value.showMenu = true)
            : (update_data.value.showMenu = false)
          row.popularMenu == 1
            ? (update_data.value.popularMenu = true)
            : (update_data.value.popularMenu = false)
          row.disableMenu == 1
            ? (update_data.value.disableMenu = true)
            : (update_data.value.disableMenu = false)
          update_data.value.search_code = row.search_code
          update_data.value.chief_percent = row.chief_percent
          let tempSum = 0
          for (let index = 0; index < row.food_tables.length; index++) {
            const element = row.food_tables[index]
            tempSum += Number(element.sum)
            updateE.value.data.push({
              food_resource_id: element.food_resource.id,
              measure_id: element.measure.id.toString(),
              amount: element.amount,
              measure: element.measure.name.toString(),
              price: element.food_resource.purchase_price.toString(),
              sum: element.sum.toString(),
              calc_sum: element.calc_sum,
            })
          }
          update_data.value.total_sum = tempSum
          showUpdate.value = true
        },
      }),
      renderCell: (value) => {
        if (!value) {
          return h(NText, { depth: 3 }, { default: () => 'empty' })
        }
        return value
      },
      columns2: createColumnsE({
        del(row, index) {
          console.log(row)
          if (createE.value.data[index].sum != '') {
            create_data.value.total_sum -= createE.value.data[index].sum
          }
          createE.value.data.splice(index, 1)
        },
      }),
      childColumns: createChildcolumns(),
      columnsModal: modalColumn(),
      columnsModal2: modalColumn2(),
      parse,
      format,
    }
  },
}
</script>

<style>
.foodR {
  display: flex;
  margin-top: 12px;
}
</style>
