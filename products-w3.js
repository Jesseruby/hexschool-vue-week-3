// 作業步驟拆解：
// 1. 建立Vue環境
// 2. 載入切好的版型
// 3. 登入驗證
// 4. 取得列表 products
// 5. 展開 modal 
// 6. 先做新增
// 7. 編輯 + 多圖上傳
// 8. 最後做刪除

import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';//作業用API
const apiPath =  'jesse-food';//作業用個人路徑

//在外層定義modal，可以給其他地方使用
let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      products:[],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,//是否為新增
    }//.return
  },//.data
  methods:{
    //3. 登入驗證
    checkLogin() {
      //取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      //給全部axios共用的headers
      axios.defaults.headers.common.Authorization = token;

      const url = `${apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })//.then
        .catch((err) => {
          console.dir(err);
          alert(err.response.data.message);//改第2周的錯誤
          window.location = 'index.html';//失敗轉回登入畫面
        })//.catch
    },//.checkLogin
    //4. 取得列表
    getData() {
      const url = `${apiUrl}/api/${apiPath}/admin/products`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;//載入產品列表
        })//.then
        .catch((err) => {
          console.dir(err);
          alert(err.response.data.message);//改第2周的錯誤
        })//.catch
    },//.getData
    // 5. 打開 modal
    openModal(isNew, item) {
      //新增
      if (isNew === 'new') {
        //清空資料
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      //編輯
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      // 刪除
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }
    },//.openModal
    //modal 產品：新增 + 編輯
    updateProduct() {  
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let http = 'post';
      //如果不是新增
      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }
      axios[http](url, { data: this.tempProduct }).then((response) => {
        alert(response.data.message);
        productModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },//.updateProduct
    //modal 產品：刪除
    removeProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.data.message);
      })
    },//.removeProduct
  },//.methods
  mounted() {
    // 3. 執行 登入驗證
    this.checkLogin();
    // 5. 載入 modal
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,//只是設定鍵盤是否能使用，可以刪除
    });
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

    // modal 的操作方式
    // productModal.show();
    // setTimeout(()=>{
    //   productModal.hide();
    // },3000)

  },//.mounted
})//.app
app.mount('#product');