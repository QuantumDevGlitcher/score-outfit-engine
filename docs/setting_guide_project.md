# Quick Guide to Install and Fix `pnpm` in SCORE

This guide is for anyone to get the project running without getting tangled up.

## 1. Open PowerShell

Open a normal **PowerShell** window.

## 2. Go to the project folder

```powershell
cd "C:\Users\YOUR_USER\Downloads\Score\score outfit engine"
```

Replace `YOUR_USER` with your Windows username.

## 3. Install `pnpm`

Use this command:

```powershell
npm install -g pnpm@latest-10
```

Then check that it was successfully installed:

```powershell
pnpm -v
```

If it shows a number like `10.x.x`, everything is fine.

---

## 4. If it says `pnpm` does not exist or is not recognized

Sometimes `pnpm` is installed, but Windows cannot find it.

Try this first in the same terminal:

```powershell
$env:Path += ";$env:APPDATA\npm"
pnpm -v
```

If it works after that, the problem was just the `PATH`.

---

## 5. Permanent fix if the `PATH` is broken

Run this in PowerShell:

```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$npmPath = "$env:APPDATA\npm"

if (($userPath -split ';') -notcontains $npmPath) {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$npmPath", "User")
}
```

After running that:

1. Close PowerShell.
2. Open it again.
3. Try this:

```powershell
pnpm -v
where.exe pnpm.*
```

If you see the version and paths like `pnpm.cmd` appear, it's fixed.

---

## 6. If IntelliJ / WebStorm says it cannot find `pnpm`

Sometimes the project works, but the IDE doesn't detect it on its own.

In that case, use this path manually in the package manager configuration:

```text
C:\Users\YOUR_USER\AppData\Roaming\npm\pnpm.cmd
```

---

## 7. Install project dependencies

Once inside the project folder, run:

```powershell
pnpm install
```

This downloads everything necessary.

---

## 8. Run the project

This is the important command to start the project:

```powershell
pnpm dev
```

When everything goes well, something like this will appear:

```text
Local: http://localhost:8080/
```

Open that address in your browser.

---

## 9. Ultra short summary

If you want to get straight to the point:

### Install `pnpm`

```powershell
npm install -g pnpm@latest-10
```

### If not recognized

```powershell
$env:Path += ";$env:APPDATA\npm"
pnpm -v
```

### Permanent `PATH` fix

```powershell
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$npmPath = "$env:APPDATA\npm"

if (($userPath -split ';') -notcontains $npmPath) {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$npmPath", "User")
}
```

### Run the project

```powershell
pnpm dev
```

---

## 10. If nothing works

Perform these 3 tests:

```powershell
node -v
npm -v
pnpm -v
```

If `node` and `npm` work but `pnpm` doesn't, the problem is almost certainly the `PATH`.
