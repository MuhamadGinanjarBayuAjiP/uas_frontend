import { JetView } from "webix-jet";
export default class Mahasiswa extends JetView {
  config() {
    var ui = {
      rows: [
        { view: "template", template: "DATA MAHASISWA", type: "header" },
        {
          view: "toolbar",
          paddingY: 2,
          cols: [
            {
              view: "button",
              click: () => this.tambah(),
              label: "Tambah",
              type: "iconButton",
              width: 100,
            },
            {
              view: "button",
              click: () => this.refresh(),
              label: "Refresh",
              type: "iconButton",
              width: 100,
            },
            { template: "", borderless: true },
            {
              view: "button",
              click: () => this.ubah(),
              label: "Ubah",
              type: "iconButton",
              width: 100,
            },
            {
              view: "button",
              click: () => this.hapus(),
              label: "Hapus",
              type: "iconButton",
              width: 100,
            },
          ],
        },
        {
          view: "datatable",
          select: true,
          id: "tabel",
          columns: [
            {
              id: "nim",
              header: ["NIM", { content: "textFilter" }],
              width: 100,
            },
            {
              id: "nama",
              header: ["Nama Mahasiswa", { content: "textFilter" }],
              width: 300,
            },
            {
              id: "alamat",
              header: ["Alamat", { content: "textFilter" }],
              width: 300,
            },
            {
              id: "jenis_kelamin",
              header: ["Jenis Kelamin", { content: "textFilter" }],
              width: 300,
            },
          ],
          pager: "pager",
        },
        {
          view: "pager",
          id: "pager",
          template: "{common.prev()} {common.pages()} {common.next()}",
          size: 20,
          group: 5,
        },
      ],
    };
    return ui;
  }

  form() {
    return {
      view: "window",
      id: "windowForm",
      width: 600,
      position: "center",
      modal: true,
      move: true,
      head: {
        view: "toolbar",
        margin: -4,
        cols: [
          { view: "label", label: "Tambah", id: "judulForm" },
          {
            view: "button",
            type: "iconButton",
            label: "Tutup",
            width: 80,
            click: "$$('windowForm').hide();",
          },
        ],
      },
      body: {
        view: "form",
        id: "form",
        borderless: true,
        elements: [
          {
            view: "text",
            label: "NIM",
            name: "nim",
            labelWidth: 100,
            required: true,
          },
          {
            view: "text",
            label: "Nama Mahasiswa",
            name: "nama",
            labelWidth: 100,
            required: true,
          },
          {
            view: "text",
            label: "Alamat",
            name: "alamat",
            labelWidth: 100,
            required: true,
          },
          {
            view: "text",
            label: "Jenis Kelamin",
            name: "jenis_kelamin",
            labelWidth: 100,
            required: true,
          },
          {
            cols: [
              { template: "", borderless: true },
              {
                view: "button",
                click: () => this.simpan(),
                label: "Simpan",
                width: 120,
                borderless: true,
              },
              { template: "", borderless: true },
            ],
          },
        ],
      },
    };
  }
  refresh() {
    $$("tabel").clearAll();
    $$("tabel").load("http://localhost:3000/mahasiswa/");
  }
  tambah() {
    $$("windowForm").show();
    $$("form").clear();
    $$("judulForm").setValue("Form Tambah Mahasiswa");
  }
  ubah() {
    var row = $$("tabel").getSelectedItem();
    if (row) {
      $$("windowForm").show();
      $$("form").clear();
      $$("form").setValues(row);
      $$("judulForm").setValue("Form Ubah Mahasiswa");
    } else {
      webix.alert("Tidak ada data akun yang dipilih");
    }
  }
  simpan() {
    var context = this;
    if ($$("form").validate()) {
      var dataKirim = $$("form").getValues();
      var callbackHasil = {
        success: function (response, data, xhr) {
          $$("windowForm").enable();
          var response = JSON.parse(response);
          webix.alert(response.pesan);
          if (response.status == true) {
            context.refresh();
            $$("windowForm").hide();
          }
        },
        error: function (text, data, xhr) {
          webix.alert(text);
          $$("windowForm").enable();
        },
      };
      $$("windowForm").disable();
      if (dataKirim.createdAt === undefined) {
        webix
          .ajax()
          .post("http://localhost:3000/mahasiswa/", dataKirim, callbackHasil);
      } else {
        webix
          .ajax()
          .put("http://localhost:3000/mahasiswa/"+dataKirim.nim, dataKirim, callbackHasil);
      }
    }
  }
  hapus() {
    var row = $$("tabel").getSelectedItem();
    if (row) {
      var context = this;
      var callbackHasil = {
        success: function (response, data, xhr) {
          $$("windowForm").enable();
          var response = JSON.parse(response);
          webix.alert(response.pesan);
          if (response.status == true) {
            context.refresh();
            $$("windowForm").hide();
          }
        },
        error: function (text, data, xhr) {
          webix.alert(text);
          $$("windowForm").enable();
        },
      };
      webix.confirm({
        type: "confirm-warning",
        title: "Konfirmasi",
        ok: "Yakin",
        cancel: "Batal",
        text: "Anda yakin ingin menghapus data ini ?",
        callback: function (jwb) {
          if (jwb) {
            webix
              .ajax()
              .del("http://localhost:3000/mahasiswa/"+row.nim, row, callbackHasil);
          }
        },
      });
    } else {
      webix.alert("Tidak ada data yang dipilih");
    }
  }
  init() {
    this.ui(this.form());
  }
  ready() {
    this.refresh();
  }
}
