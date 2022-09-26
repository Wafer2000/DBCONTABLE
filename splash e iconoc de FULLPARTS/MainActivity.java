package io.ionic.starter;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  int REQUEST_CODE = 200;
  @RequiresApi(api = Build.VERSION_CODES.M)

  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    verificarPermisos();
  }

  @RequiresApi(api = Build.VERSION_CODES.M)
  private void verificarPermisos() {
    int PermisosAlma = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);

    if (PermisosAlma == PackageManager.PERMISSION_GRANTED){
      Toast.makeText(this, "Permiso de Alamcenamiento Concedido", Toast.LENGTH_SHORT).show();
    }else {
      requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
    }
  }

}
