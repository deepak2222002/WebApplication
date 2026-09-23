package web.minda.project.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import web.minda.project.entity.BinLocationAndQuantityMaster;
import web.minda.project.entity.PackingHistoryMaster;

public interface PackingHistoryRepository extends JpaRepository<PackingHistoryMaster, Long> {


}
