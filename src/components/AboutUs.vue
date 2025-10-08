<script setup>
import Aaron from "../assets/images/Aaron.jpg";
import Connor from "../assets/images/Connor.jpg";
import Emmett from "../assets/images/Emmett.jpg";
import Simon from "../assets/images/Simon.jpg";
import Eli from "../assets/images/Eli.jpg";

const members = [
  { name: 'Aaron', photo: Aaron, email: 'kinga2014@my.uwstout.edu', linkedin: 'https://www.linkedin.com/in/kampingcodes/' },
  { name: 'Konnor', photo: Connor, email: 'petersonk7465@my.uwstout.edu', linkedin: 'https://www.linkedin.com/in/konnor-peterson-265a7937b/' },
  { name: 'Emmett', photo: Emmett, email: 'jaakkolae7110@my.uwstout.edu', linkedin: 'https://www.linkedin.com/in/emmett-jaakkola-234667208/' },
  { name: 'Simon', photo: Simon, email: 'skrochs0971@my.uwstout.edu', linkedin: 'https://www.linkedin.com/in/simon-skroch-08922a298/' },
  { name: 'Eli', photo: Eli, email: 'curle4271@my.uwstout.edu', linkedin: 'https://www.linkedin.com/in/eli-curl-2592022a2/' },
];

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const rows = chunkArray(members, 2);
</script>

<template>
  <div class="untree_co-section" id="about-section">
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 text-center" data-aos="fade-up" data-aos-delay="0">
          <h2 class="heading">Meet the Devs</h2>
          <p>Give us jobs.</p>
        </div>
      </div>

      <div class="row">
        <template v-for="(row, rowIndex) in rows" :key="rowIndex">
          <div class="w-100" />
          <div
            v-for="(member, idx) in row"
            :key="member.name"
            :class="['col-md-6', row.length === 1 ? 'offset-md-3' : '']"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="d-flex align-items-center member-row mb-4">
              <img :src="member.photo" alt="" class="member-photo" />
              <div class="member-info">
                <h4 class="mb-1">{{ member.name }}</h4>
                <div class="mb-1"><a :href="`mailto:${member.email}`">{{ member.email }}</a></div>
                <div><a :href="member.linkedin" target="_blank" rel="noopener">LinkedIn</a></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.member-row {
  gap: 1rem;
}
.member-photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
}
.member-info h4 {
  margin: 0;
}
.member-info a {
  color: #0d6efd;
  text-decoration: underline;
}

@media (max-width: 767.98px) {
  .member-photo {
    width: 90px;
    height: 90px;
  }
}

.member-row {
  align-items: center;
}
</style>
